import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
    }

    const { lessonId, courseId, secondsWatched, totalSeconds, isCompleted } = await req.json();

    if (!lessonId || !courseId) {
      return NextResponse.json({ error: 'Thiếu thông tin lessonId hoặc courseId' }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare(`
      SELECT id, is_completed, seconds_watched 
      FROM lesson_progress 
      WHERE user_id = ? AND lesson_id = ?
    `).get(user.id, lessonId) as any;

    if (existing) {
      const willBeCompleted = isCompleted ? 1 : existing.is_completed;
      const maxSeconds = Math.max(existing.seconds_watched, secondsWatched || 0);

      db.prepare(`
        UPDATE lesson_progress 
        SET seconds_watched = ?, 
            total_seconds = COALESCE(?, total_seconds),
            is_completed = ?,
            last_watched_at = datetime('now'),
            completed_at = CASE WHEN ? = 1 AND completed_at IS NULL THEN datetime('now') ELSE completed_at END
        WHERE id = ?
      `).run(maxSeconds, totalSeconds || null, willBeCompleted, willBeCompleted, existing.id);
    } else {
      const progId = 'prog_' + crypto.randomBytes(6).toString('hex');
      const completedVal = isCompleted ? 1 : 0;

      db.prepare(`
        INSERT INTO lesson_progress (
          id, user_id, lesson_id, course_id, seconds_watched, total_seconds, is_completed, last_watched_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), CASE WHEN ? = 1 THEN datetime('now') ELSE NULL END)
      `).run(progId, user.id, lessonId, courseId, secondsWatched || 0, totalSeconds || 0, completedVal, completedVal);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
