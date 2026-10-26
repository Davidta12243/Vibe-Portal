import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để nộp bài kiểm tra' }, { status: 401 });
    }

    const { id: quizId } = await params;
    const { answers } = await req.json(); // Map questionId -> optionId

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Dữ liệu câu trả lời không hợp lệ' }, { status: 400 });
    }

    const db = getDb();

    // 1. Lấy thông tin bài kiểm tra
    const quiz = db.prepare(`
      SELECT id, lesson_id, title, passing_score, max_attempts
      FROM quizzes
      WHERE id = ?
    `).get(quizId) as any;

    if (!quiz) {
      return NextResponse.json({ error: 'Bài kiểm tra không tồn tại' }, { status: 404 });
    }

    // 2. Kiểm tra số lần làm bài trước đó
    const attempts = db.prepare(`
      SELECT count(*) as count FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?
    `).get(user.id, quizId) as { count: number };

    const currentAttemptCount = attempts.count + 1;
    if (quiz.max_attempts && currentAttemptCount > quiz.max_attempts) {
      return NextResponse.json({ error: 'Bạn đã sử dụng hết số lần làm bài cho phép' }, { status: 403 });
    }

    // 3. Lấy tất cả câu hỏi và đáp án đúng từ database
    const questions = db.prepare(`
      SELECT id, question_text, explanation, points
      FROM quiz_questions
      WHERE quiz_id = ?
      ORDER BY order_index ASC
    `).all(quizId) as any[];

    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;
    const explanations: Record<string, any> = {};

    for (const q of questions) {
      totalPoints += q.points;

      // Tìm đáp án đúng trong DB
      const correctOption = db.prepare(`
        SELECT id, option_text FROM quiz_options WHERE question_id = ? AND is_correct = 1
      `).get(q.id) as any;

      const userSelectedOptionId = answers[q.id];
      const isCorrect = correctOption && userSelectedOptionId === correctOption.id;

      if (isCorrect) {
        earnedPoints += q.points;
        correctCount += 1;
      }

      explanations[q.id] = {
        isCorrect,
        correctOptionId: correctOption ? correctOption.id : null,
        explanation: q.explanation || (isCorrect ? 'Chính xác!' : 'Đáp án chưa chính xác.'),
      };
    }

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 100;
    const isPassed = finalScore >= quiz.passing_score;

    // 4. Lưu kết quả vào quiz_attempts
    const attemptId = 'att_' + crypto.randomBytes(6).toString('hex');
    db.prepare(`
      INSERT INTO quiz_attempts (
        id, user_id, quiz_id, score, is_passed, answers_payload, attempt_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      attemptId,
      user.id,
      quizId,
      finalScore,
      isPassed ? 1 : 0,
      JSON.stringify(answers),
      currentAttemptCount
    );

    // 5. Nếu đạt bài kiểm tra, cập nhật đánh dấu hoàn thành bài học
    if (isPassed && quiz.lesson_id) {
      const lesson = db.prepare('SELECT section_id FROM lessons WHERE id = ?').get(quiz.lesson_id) as any;
      if (lesson) {
        const sec = db.prepare('SELECT course_id FROM course_sections WHERE id = ?').get(lesson.section_id) as any;
        if (sec) {
          db.prepare(`
            UPDATE lesson_progress 
            SET is_completed = 1, completed_at = datetime('now')
            WHERE user_id = ? AND lesson_id = ?
          `).run(user.id, quiz.lesson_id);
        }
      }
    }

    return NextResponse.json({
      score: finalScore,
      isPassed,
      totalQuestions: questions.length,
      correctCount,
      explanations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
