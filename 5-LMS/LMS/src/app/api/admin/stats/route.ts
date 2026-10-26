import { NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();

    // 1. Thống kê tổng quan
    const totalUsers = db.prepare('SELECT count(*) as count FROM profiles').get() as { count: number };
    const totalCourses = db.prepare('SELECT count(*) as count FROM courses').get() as { count: number };
    const totalRevenue = db.prepare(`
      SELECT COALESCE(sum(amount), 0) as total FROM payments WHERE status = 'success'
    `).get() as { total: number };
    const totalOrders = db.prepare('SELECT count(*) as count FROM orders').get() as { count: number };
    const paidOrders = db.prepare(`SELECT count(*) as count FROM orders WHERE status = 'paid'`).get() as { count: number };
    const totalProgressCount = db.prepare('SELECT count(*) as count FROM lesson_progress WHERE is_completed = 1').get() as { count: number };
    const totalQuizPassed = db.prepare('SELECT count(*) as count FROM quiz_attempts WHERE is_passed = 1').get() as { count: number };

    // 2. Danh sách đơn hàng gần đây
    const recentOrders = db.prepare(`
      SELECT o.id, o.order_code, o.total_amount, o.status, o.created_at, p.full_name, p.email,
             prod.title as product_title
      FROM orders o
      JOIN profiles p ON o.user_id = p.id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products prod ON oi.product_id = prod.id
      ORDER BY o.created_at DESC
      LIMIT 8
    `).all();

    // 3. Hiệu quả video demo
    const coursesDemoStats = db.prepare(`
      SELECT id, title, slug, price, demo_5m_title, demo_20m_title
      FROM courses
      ORDER BY created_at DESC
    `).all();

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers.count,
        totalCourses: totalCourses.count,
        totalRevenue: totalRevenue.total,
        totalOrders: totalOrders.count,
        paidOrders: paidOrders.count,
        totalCompletions: totalProgressCount.count,
        totalQuizPassed: totalQuizPassed.count,
      },
      recentOrders,
      coursesDemoStats,
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN_ADMIN_ONLY' || error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Chỉ Quản trị viên mới có quyền truy cập trang này' }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
