import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { generateOrderCode } from '@/lib/payment';
import { checkCourseAccess } from '@/lib/entitlements';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để tiến hành thanh toán' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Thiếu mã sản phẩm productId' }, { status: 400 });
    }

    const db = getDb();

    // 1. Server tự tra giá từ database (Bảo mật: không tin giá từ frontend)
    const product = db.prepare(`
      SELECT p.*, pe.course_id 
      FROM products p
      LEFT JOIN product_entitlements pe ON pe.product_id = p.id
      WHERE p.id = ? AND p.is_active = 1
    `).get(productId) as any;

    if (!product) {
      return NextResponse.json({ error: 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh' }, { status: 404 });
    }

    // 2. Kiểm tra nếu là khóa học đơn lẻ và người dùng đã sở hữu thì không yêu cầu mua lại
    if (product.type === 'single_course' && product.course_id) {
      const access = checkCourseAccess(user.id, product.course_id);
      if (access.hasAccess && access.reason === 'purchase') {
        return NextResponse.json(
          { error: 'Bạn đã sở hữu khóa học này vĩnh viễn trong tài khoản. Không cần mua lại.' },
          { status: 400 }
        );
      }
    }

    // 3. Tạo mã đơn hàng duy nhất và lưu vào DB
    const orderCode = generateOrderCode();
    const orderId = 'ord_' + crypto.randomBytes(6).toString('hex');
    const orderItemId = 'oi_' + crypto.randomBytes(6).toString('hex');

    db.transaction(() => {
      db.prepare(`
        INSERT INTO orders (id, order_code, user_id, total_amount, status, payment_method)
        VALUES (?, ?, ?, ?, 'pending', 'vietqr')
      `).run(orderId, orderCode, user.id, product.price);

      db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, price, quantity)
        VALUES (?, ?, ?, ?, 1)
      `).run(orderItemId, orderId, product.id, product.price);
    })();

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderCode,
        totalAmount: product.price,
        productTitle: product.title,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
