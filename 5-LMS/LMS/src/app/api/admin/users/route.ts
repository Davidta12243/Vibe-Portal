import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import crypto from 'crypto';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();

    const users = db.prepare(`
      SELECT id, email, full_name, role, avatar_url, created_at
      FROM profiles
      ORDER BY created_at DESC
    `).all() as any[];

    // Lấy danh sách entitlements của từng user
    const usersWithEntitlements = users.map((u) => {
      const entitlements = db.prepare(`
        SELECT e.id, e.course_id, e.source_type, e.expires_at, e.is_active, c.title as course_title
        FROM entitlements e
        JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = ?
      `).all(u.id);

      return {
        ...u,
        entitlements,
      };
    });

    return NextResponse.json({ users: usersWithEntitlements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { userId, courseId, action, days } = await req.json(); // action: 'grant' | 'revoke'

    if (!userId || !courseId || !action) {
      return NextResponse.json({ error: 'Thiếu thông tin userId, courseId hoặc action' }, { status: 400 });
    }

    const db = getDb();

    if (action === 'grant') {
      const entId = 'ent_' + crypto.randomBytes(6).toString('hex');
      const expiry = days ? `datetime('now', '+${days} days')` : 'NULL';

      db.prepare(`
        INSERT INTO entitlements (id, user_id, course_id, source_type, source_id, expires_at, is_active)
        VALUES (?, ?, ?, 'manual_grant', ?, ${expiry}, 1)
      `).run(entId, userId, courseId, admin.id);

      // Audit Log
      const auditId = 'aud_' + crypto.randomBytes(6).toString('hex');
      db.prepare(`
        INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details)
        VALUES (?, ?, 'MANUAL_GRANT_ENTITLEMENT', 'entitlement', ?, ?)
      `).run(
        auditId,
        admin.id,
        entId,
        JSON.stringify({ target_user: userId, course_id: courseId, days: days || 'permanent' })
      );
    } else if (action === 'revoke') {
      db.prepare(`
        UPDATE entitlements SET is_active = 0 WHERE user_id = ? AND course_id = ?
      `).run(userId, courseId);

      // Audit Log
      const auditId = 'aud_' + crypto.randomBytes(6).toString('hex');
      db.prepare(`
        INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details)
        VALUES (?, ?, 'MANUAL_REVOKE_ENTITLEMENT', 'entitlement', ?, ?)
      `).run(
        auditId,
        admin.id,
        userId,
        JSON.stringify({ target_user: userId, course_id: courseId })
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
