import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';
import crypto from 'crypto';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();

    const invitations = db.prepare(`
      SELECT i.*, p.full_name as creator_name
      FROM invitations i
      LEFT JOIN profiles p ON i.created_by = p.id
      ORDER BY i.created_at DESC
    `).all();

    return NextResponse.json({ invitations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { code, maxUses, expiresAt, role } = await req.json();

    const cleanCode = (code || 'INV-' + crypto.randomBytes(3).toString('hex')).trim().toUpperCase();
    const inviteId = 'inv_' + crypto.randomBytes(6).toString('hex');
    const db = getDb();

    // Kiểm tra trùng mã
    const existing = db.prepare('SELECT id FROM invitations WHERE code = ?').get(cleanCode);
    if (existing) {
      return NextResponse.json({ error: 'Mã mời này đã tồn tại, vui lòng chọn mã khác' }, { status: 400 });
    }

    db.prepare(`
      INSERT INTO invitations (id, code, created_by, role, max_uses, used_count, expires_at, is_revoked)
      VALUES (?, ?, ?, ?, ?, 0, ?, 0)
    `).run(
      inviteId,
      cleanCode,
      admin.id,
      role || 'student',
      Number(maxUses) || 1,
      expiresAt || null
    );

    // Ghi Audit Log
    const auditId = 'aud_' + crypto.randomBytes(6).toString('hex');
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details)
      VALUES (?, ?, 'CREATE_INVITATION', 'invitation', ?, ?)
    `).run(
      auditId,
      admin.id,
      inviteId,
      JSON.stringify({ code: cleanCode, maxUses, expiresAt })
    );

    return NextResponse.json({ success: true, code: cleanCode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Thiếu id' }, { status: 400 });

    const db = getDb();
    // Đánh dấu thu hồi is_revoked = 1 thay vì xóa cứng để lưu vết
    db.prepare('UPDATE invitations SET is_revoked = 1 WHERE id = ?').run(id);

    // Audit Log
    const auditId = 'aud_' + crypto.randomBytes(6).toString('hex');
    db.prepare(`
      INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details)
      VALUES (?, ?, 'REVOKE_INVITATION', 'invitation', ?, ?)
    `).run(auditId, admin.id, id, JSON.stringify({ is_revoked: 1 }));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
