import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { checkLessonAccess } from '@/lib/entitlements';
import { seedDatabase } from '@/db/seed';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    seedDatabase();

    const { id: lessonId } = await params;
    const user = await getCurrentUser();
    const db = getDb();

    // 1. Lấy thông tin bài học
    const lesson = db.prepare(`
      SELECT l.*, s.course_id, s.title as section_title, c.title as course_title, c.slug as course_slug,
             c.demo_5m_url, c.demo_5m_title, c.demo_20m_url, c.demo_20m_title
      FROM lessons l
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE l.id = ?
    `).get(lessonId) as any;

    if (!lesson) {
      return NextResponse.json({ error: 'Bài học không tồn tại' }, { status: 404 });
    }

    // 2. Kiểm tra quyền truy cập bài học
    const access = checkLessonAccess(user?.id || null, lessonId);

    // 3. Lấy danh sách tài liệu (Resources)
    const resources = db.prepare(`
      SELECT id, title, resource_type, file_url, file_size_bytes
      FROM lesson_resources
      WHERE lesson_id = ?
      ORDER BY order_index ASC
    `).all(lessonId) as any[];

    // 4. Lấy Quiz gắn với bài học (nếu có)
    const quiz = db.prepare(`
      SELECT id, title, description, passing_score, max_attempts
      FROM quizzes
      WHERE lesson_id = ?
    `).get(lessonId) as any;

    let quizData = null;
    if (quiz) {
      const questions = db.prepare(`
        SELECT id, question_text, points
        FROM quiz_questions
        WHERE quiz_id = ?
        ORDER BY order_index ASC
      `).all(quiz.id) as any[];

      const questionsWithOptions = questions.map((q) => {
        // KHÔNG trả is_correct cho client trước khi nộp bài
        const options = db.prepare(`
          SELECT id, option_text
          FROM quiz_options
          WHERE question_id = ?
          ORDER BY order_index ASC
        `).all(q.id);

        return {
          ...q,
          options,
        };
      });

      // Lấy số lần đã làm của user
      let previousAttemptsCount = 0;
      if (user) {
        const attempt = db.prepare(`
          SELECT count(*) as count FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?
        `).get(user.id, quiz.id) as { count: number };
        previousAttemptsCount = attempt?.count || 0;
      }

      quizData = {
        ...quiz,
        questions: questionsWithOptions,
        previousAttemptsCount,
      };
    }

    // 5. Lấy toàn bộ lộ trình các bài học trong khóa học để điều hướng sidebar
    const allSections = db.prepare(`
      SELECT id, title FROM course_sections WHERE course_id = ? ORDER BY order_index ASC
    `).all(lesson.course_id) as any[];

    const curriculum = allSections.map((sec) => {
      const secLessons = db.prepare(`
        SELECT id, title, is_free_preview, video_duration_seconds, order_index
        FROM lessons
        WHERE section_id = ?
        ORDER BY order_index ASC
      `).all(sec.id) as any[];

      const withProgress = secLessons.map((l) => {
        let isCompleted = 0;
        if (user) {
          const prog = db.prepare('SELECT is_completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?').get(user.id, l.id) as any;
          if (prog) isCompleted = prog.is_completed;
        }
        return {
          ...l,
          isCompleted: isCompleted === 1,
        };
      });

      return {
        id: sec.id,
        title: sec.title,
        lessons: withProgress,
      };
    });

    // 6. Lấy tiến độ học bài hiện tại
    let currentProgress = { seconds_watched: 0, is_completed: 0 };
    if (user) {
      const p = db.prepare('SELECT seconds_watched, is_completed FROM lesson_progress WHERE user_id = ? AND lesson_id = ?').get(user.id, lessonId) as any;
      if (p) currentProgress = p;
    }

    return NextResponse.json({
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        section_title: lesson.section_title,
        course_id: lesson.course_id,
        course_title: lesson.course_title,
        course_slug: lesson.course_slug,
        is_free_preview: lesson.is_free_preview === 1,
        canViewFull: access.hasAccess,
        video_url: access.hasAccess ? lesson.video_url : null,
        content_markdown: access.hasAccess ? lesson.content_markdown : null,
        demo_5m_url: lesson.demo_5m_url,
        demo_5m_title: lesson.demo_5m_title,
        demo_20m_url: lesson.demo_20m_url,
        demo_20m_title: lesson.demo_20m_title,
        progress: currentProgress,
        resources: access.hasAccess ? resources : [],
        quiz: access.hasAccess ? quizData : null,
      },
      curriculum,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
