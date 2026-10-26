import { NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    seedDatabase();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const db = getDb();

    // 1. Lấy thông tin tài khoản đầy đủ
    const profile = db.prepare(`
      SELECT id, email, full_name, avatar_url, role, bio, created_at
      FROM profiles WHERE id = ?
    `).get(user.id);

    // 2. Lấy gói thành viên đang hiệu lực (Active Subscriptions)
    const activeSubscription = db.prepare(`
      SELECT s.*, p.title as product_title, p.type as product_type
      FROM subscriptions s
      JOIN products p ON s.product_id = p.id
      WHERE s.user_id = ? AND s.status = 'active' AND s.expires_at > datetime('now')
      ORDER BY s.expires_at DESC
      LIMIT 1
    `).get(user.id) as any;

    // 3. Lấy danh sách các khóa học người dùng đang học (có tiến độ) hoặc có quyền truy cập
    const ownedCourseIds = db.prepare(`
      SELECT DISTINCT course_id 
      FROM entitlements 
      WHERE user_id = ? AND is_active = 1 
        AND (expires_at IS NULL OR expires_at > datetime('now'))
    `).all(user.id) as Array<{ course_id: string }>;

    const enrolledCourses = [];
    for (const item of ownedCourseIds) {
      const course = db.prepare(`
        SELECT id, slug, title, thumbnail_url, category, duration_minutes, instructor_name
        FROM courses WHERE id = ?
      `).get(item.course_id) as any;

      if (course) {
        // Đếm tổng số bài học và số bài đã hoàn thành
        const totalLessons = db.prepare(`
          SELECT count(l.id) as count
          FROM lessons l
          JOIN course_sections s ON l.section_id = s.id
          WHERE s.course_id = ?
        `).get(course.id) as { count: number };

        const completedLessons = db.prepare(`
          SELECT count(id) as count
          FROM lesson_progress
          WHERE user_id = ? AND course_id = ? AND is_completed = 1
        `).get(user.id, course.id) as { count: number };

        // Lấy bài học học gần nhất
        const lastWatched = db.prepare(`
          SELECT lp.lesson_id, lp.seconds_watched, lp.last_watched_at, l.title as lesson_title
          FROM lesson_progress lp
          JOIN lessons l ON lp.lesson_id = l.id
          WHERE lp.user_id = ? AND lp.course_id = ?
          ORDER BY lp.last_watched_at DESC
          LIMIT 1
        `).get(user.id, course.id) as any;

        const total = totalLessons?.count || 1;
        const completed = completedLessons?.count || 0;
        const progressPercentage = Math.round((completed / total) * 100);

        enrolledCourses.push({
          ...course,
          totalLessons: total,
          completedLessons: completed,
          progressPercentage,
          lastWatched,
        });
      }
    }

    // 4. Bài tập chưa hoàn thành (Pending Quizzes)
    const pendingQuizzes = db.prepare(`
      SELECT q.id as quiz_id, q.title as quiz_title, q.passing_score,
             l.id as lesson_id, l.title as lesson_title, c.title as course_title, c.slug as course_slug
      FROM quizzes q
      JOIN lessons l ON q.lesson_id = l.id
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE s.course_id IN (SELECT course_id FROM entitlements WHERE user_id = ? AND is_active = 1)
        AND q.id NOT IN (
          SELECT quiz_id FROM quiz_attempts WHERE user_id = ? AND is_passed = 1
        )
      LIMIT 5
    `).all(user.id, user.id);

    // 5. Tài liệu truy cập gần đây (Tài liệu từ các bài học đang học)
    const recentResources = db.prepare(`
      SELECT r.id, r.title, r.resource_type, r.file_url, l.title as lesson_title, c.title as course_title
      FROM lesson_resources r
      JOIN lessons l ON r.lesson_id = l.id
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE s.course_id IN (SELECT course_id FROM entitlements WHERE user_id = ? AND is_active = 1)
      LIMIT 4
    `).all(user.id);

    // 6. Bài học gần nhất để kích hoạt nút "Tiếp Tục Học"
    const nextLessonToContinue = db.prepare(`
      SELECT l.id as lesson_id, l.title as lesson_title, c.title as course_title, c.slug as course_slug
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      JOIN courses c ON lp.course_id = c.id
      WHERE lp.user_id = ?
      ORDER BY lp.last_watched_at DESC
      LIMIT 1
    `).get(user.id) as any;

    return NextResponse.json({
      profile,
      activeSubscription,
      enrolledCourses,
      pendingQuizzes,
      recentResources,
      nextLessonToContinue,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
