import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { checkCourseAccess } from '@/lib/entitlements';
import { seedDatabase } from '@/db/seed';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    seedDatabase();

    const { slug } = await params;
    const user = await getCurrentUser();
    const db = getDb();

    // 1. Lấy thông tin khóa học
    const course = db.prepare(`
      SELECT * FROM courses WHERE slug = ? AND is_published = 1
    `).get(slug) as any;

    if (!course) {
      return NextResponse.json({ error: 'Không tìm thấy khóa học' }, { status: 404 });
    }

    // 2. Kiểm tra quyền truy cập toàn bộ khóa học
    const access = checkCourseAccess(user?.id || null, course.id);

    // 3. Lấy các chương học (Sections)
    const sections = db.prepare(`
      SELECT * FROM course_sections WHERE course_id = ? ORDER BY order_index ASC
    `).all(course.id) as any[];

    // 4. Lấy các bài học trong từng chương
    const enrichedSections = sections.map((sec) => {
      const lessons = db.prepare(`
        SELECT id, section_id, title, description, is_free_preview, video_duration_seconds, order_index,
               video_url, content_markdown
        FROM lessons
        WHERE section_id = ?
        ORDER BY order_index ASC
      `).all(sec.id) as any[];

      const sanitizedLessons = lessons.map((lsn) => {
        // Chỉ cấp video_url và nội dung bài học nếu user có quyền hoặc bài học là preview miễn phí
        const canViewFull = access.hasAccess || lsn.is_free_preview === 1;

        // Lấy tiến độ học nếu đã đăng nhập
        let progress = null;
        if (user) {
          progress = db.prepare(`
            SELECT seconds_watched, total_seconds, is_completed, last_watched_at
            FROM lesson_progress
            WHERE user_id = ? AND lesson_id = ?
          `).get(user.id, lsn.id);
        }

        return {
          id: lsn.id,
          title: lsn.title,
          description: lsn.description,
          order_index: lsn.order_index,
          is_free_preview: lsn.is_free_preview === 1,
          video_duration_seconds: lsn.video_duration_seconds,
          canViewFull,
          video_url: canViewFull ? lsn.video_url : null, // Bảo vệ URL video full ở backend
          content_markdown: canViewFull ? lsn.content_markdown : null,
          progress: progress || { seconds_watched: 0, is_completed: 0 },
        };
      });

      return {
        ...sec,
        lessons: sanitizedLessons,
      };
    });

    // Parse JSON arrays
    let learningOutcomes = [];
    let targetAudience = [];
    try {
      learningOutcomes = JSON.parse(course.learning_outcomes || '[]');
      targetAudience = JSON.parse(course.target_audience || '[]');
    } catch (e) {}

    return NextResponse.json({
      course: {
        ...course,
        learning_outcomes: learningOutcomes,
        target_audience: targetAudience,
        hasAccess: access.hasAccess,
        accessReason: access.reason,
        expiresAt: access.expiresAt,
        sections: enrichedSections,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
