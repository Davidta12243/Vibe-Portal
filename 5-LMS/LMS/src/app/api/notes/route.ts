import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ notes: [] });
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Thiếu lessonId' }, { status: 400 });
    }

    const db = getDb();
    // Row Level Security: Người học chỉ đọc ghi chú của chính mình
    const notes = db.prepare(`
      SELECT id, timestamp_seconds, content, created_at
      FROM lesson_notes
      WHERE user_id = ? AND lesson_id = ?
      ORDER BY timestamp_seconds ASC, created_at DESC
    `).all(user.id, lessonId);

    return NextResponse.json({ notes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
    }

    const { lessonId, timestampSeconds, content } = await req.json();

    if (!lessonId || !content?.trim()) {
      return NextResponse.json({ error: 'Nội dung ghi chú không được trống' }, { status: 400 });
    }

    const db = getDb();
    const noteId = 'nte_' + crypto.randomBytes(6).toString('hex');

    db.prepare(`
      INSERT INTO lesson_notes (id, user_id, lesson_id, timestamp_seconds, content)
      VALUES (?, ?, ?, ?, ?)
    `).run(noteId, user.id, lessonId, timestampSeconds || 0, content.trim());

    return NextResponse.json({ success: true, noteId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const noteId = searchParams.get('id');

    if (!noteId) {
      return NextResponse.json({ error: 'Thiếu note id' }, { status: 400 });
    }

    const db = getDb();
    // Đảm bảo chỉ chủ sở hữu mới có quyền xóa ghi chú
    db.prepare(`
      DELETE FROM lesson_notes WHERE id = ? AND user_id = ?
    `).run(noteId, user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
