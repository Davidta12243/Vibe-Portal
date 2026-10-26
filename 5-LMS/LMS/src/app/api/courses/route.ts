import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { checkCourseAccess } from '@/lib/entitlements';
import { seedDatabase } from '@/db/seed';

export async function GET(req: NextRequest) {
  try {
    seedDatabase();

    const user = await getCurrentUser();
    const db = getDb();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const filterType = searchParams.get('filterType') || ''; // 'all', 'owned', 'free', 'membership'

    let query = `
      SELECT id, slug, title, subtitle, description, thumbnail_url,
             instructor_name, instructor_title, instructor_avatar,
             category, level, duration_minutes, price,
             demo_5m_title, demo_20m_title
      FROM courses
      WHERE is_published = 1
    `;
    const params: any[] = [];

    if (search.trim()) {
      query += ` AND (title LIKE ? OR description LIKE ? OR instructor_name LIKE ?)`;
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }

    if (level && level !== 'all') {
      query += ` AND level = ?`;
      params.push(level);
    }

    query += ` ORDER BY created_at DESC`;

    const courses = db.prepare(query).all(...params) as any[];

    // Gắn thông tin quyền truy cập cho từng khóa học
    const formatted = courses.map((c) => {
      const access = checkCourseAccess(user?.id || null, c.id);
      return {
        ...c,
        hasAccess: access.hasAccess,
        accessReason: access.reason,
        expiresAt: access.expiresAt,
      };
    });

    // Lọc theo filterType nếu có
    let result = formatted;
    if (filterType === 'owned') {
      result = formatted.filter((c) => c.hasAccess);
    } else if (filterType === 'free') {
      result = formatted.filter((c) => c.price === 0);
    }

    return NextResponse.json({ courses: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
