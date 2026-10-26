import { getDb } from '@/db/schema';
import crypto from 'crypto';
import { BANK_CONFIG, generateVietQrUrl } from './payment-config';

export { BANK_CONFIG, generateVietQrUrl };

/**
 * Tạo mã đơn hàng duy nhất: LMS-ORD-YYYYMMDD-XXXX
 */
export function generateOrderCode(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `LMS-ORD-${dateStr}-${randomSuffix}`;
}

/**
 * Xử lý hoàn tất đơn hàng và cấp Entitlements tự động (có idempotency)
 */
export function processSuccessfulPayment(params: {
  orderCode: string;
  transactionId: string;
  gateway?: string;
  paidAmount: number;
  rawPayload?: any;
}) {
  const db = getDb();

  return db.transaction(() => {
    // 1. Kiểm tra đơn hàng trong DB
    const order = db.prepare(`
      SELECT id, order_code, user_id, total_amount, status 
      FROM orders 
      WHERE order_code = ?
    `).get(params.orderCode) as { id: string; order_code: string; user_id: string; total_amount: number; status: string } | undefined;

    if (!order) {
      throw new Error(`ORDER_NOT_FOUND: ${params.orderCode}`);
    }

    // Nếu đơn hàng đã hoàn tất trước đó, bỏ qua để đảm bảo Idempotency
    if (order.status === 'paid') {
      return { success: true, message: 'ORDER_ALREADY_PAID', orderId: order.id };
    }

    // Kiểm tra số tiền chuyển khớp với tổng tiền đơn hàng
    if (params.paidAmount < order.total_amount) {
      throw new Error(`INSUFFICIENT_PAYMENT: Expected ${order.total_amount}, got ${params.paidAmount}`);
    }

    // 2. Kiểm tra giao dịch đã được ghi nhận chưa (Idempotency Key)
    const idempotencyKey = `tx_${params.transactionId || params.orderCode}`;
    const existingPayment = db.prepare('SELECT id FROM payments WHERE idempotency_key = ?').get(idempotencyKey);
    if (existingPayment) {
      return { success: true, message: 'PAYMENT_ALREADY_PROCESSED', orderId: order.id };
    }

    // 3. Ghi nhận thanh toán vào bảng payments
    const paymentId = 'pay_' + crypto.randomBytes(8).toString('hex');
    db.prepare(`
      INSERT INTO payments (
        id, order_id, transaction_id, gateway, amount, status, raw_payload, idempotency_key, paid_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
      paymentId,
      order.id,
      params.transactionId,
      params.gateway || 'sepay_vietqr',
      params.paidAmount,
      'success',
      JSON.stringify(params.rawPayload || {}),
      idempotencyKey
    );

    // 4. Cập nhật trạng thái đơn hàng thành 'paid'
    db.prepare(`
      UPDATE orders 
      SET status = 'paid', updated_at = datetime('now') 
      WHERE id = ?
    `).run(order.id);

    // 5. Cấp quyền truy cập tương ứng cho các sản phẩm trong đơn hàng
    const orderItems = db.prepare(`
      SELECT oi.product_id, p.type, p.duration_days
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id) as Array<{ product_id: string; type: string; duration_days: number | null }>;

    for (const item of orderItems) {
      if (item.type === 'single_course') {
        const linkedCourses = db.prepare(`
          SELECT course_id FROM product_entitlements WHERE product_id = ?
        `).all(item.product_id) as Array<{ course_id: string }>;

        for (const c of linkedCourses) {
          if (c.course_id) {
            const entId = 'ent_' + crypto.randomBytes(8).toString('hex');
            db.prepare(`
              INSERT INTO entitlements (id, user_id, course_id, source_type, source_id, expires_at, is_active)
              VALUES (?, ?, ?, 'purchase', ?, NULL, 1)
            `).run(entId, order.user_id, c.course_id, order.id);
          }
        }
      } else if (item.type === 'membership_monthly' || item.type === 'membership_yearly') {
        const durationDays = item.duration_days || (item.type === 'membership_yearly' ? 365 : 30);
        const subId = 'sub_' + crypto.randomBytes(8).toString('hex');

        db.prepare(`
          INSERT INTO subscriptions (id, user_id, product_id, order_id, status, starts_at, expires_at)
          VALUES (?, ?, ?, ?, 'active', datetime('now'), datetime('now', '+${durationDays} days'))
        `).run(subId, order.user_id, item.product_id, order.id);
      }
    }

    // 6. Ghi Audit Log
    const auditId = 'aud_' + crypto.randomBytes(8).toString('hex');
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details)
      VALUES (?, ?, 'PAYMENT_COMPLETED', 'order', ?, ?)
    `).run(
      auditId,
      order.user_id,
      order.id,
      JSON.stringify({
        order_code: order.order_code,
        amount: params.paidAmount,
        transaction_id: params.transactionId,
      })
    );

    return { success: true, message: 'ORDER_FULFILLED', orderId: order.id };
  })();
}
