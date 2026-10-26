import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderCode: string }> }) {
  try {
    const { orderCode } = await params;
    const user = await getCurrentUser();
    const db = getDb();

    const order = db.prepare(`
      SELECT o.*, oi.product_id, p.title as product_title, p.type as product_type,
             pay.transaction_id, pay.paid_at
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      LEFT JOIN payments pay ON pay.order_id = o.id
      WHERE o.order_code = ?
    `).get(orderCode) as any;

    if (!order) {
      return NextResponse.json({ error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    // Bảo mật: Người dùng chỉ được xem đơn hàng của chính mình (hoặc admin)
    if (user && user.role !== 'admin' && order.user_id !== user.id) {
      return NextResponse.json({ error: 'Không có quyền truy cập đơn hàng này' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
