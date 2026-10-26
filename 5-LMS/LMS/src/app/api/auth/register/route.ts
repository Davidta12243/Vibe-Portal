import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import { seedDatabase } from '@/db/seed';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    seedDatabase();

    const { email, password, fullName, inviteCode } = await req.json();

    if (!email || !password || !fullName || !inviteCode) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email, Mật khẩu và Mã mời' },
        { status: 400 }
      );
    }

    const db = getDb();

    // 1. Kiểm tra mã mời (Invitation Code)
    const invitation = db.prepare(`
      SELECT id, code, email as assigned_email, role, max_uses, used_count, expires_at, is_revoked, created_by
      FROM invitations
      WHERE code = ?
    `).get(inviteCode.trim().toUpperCase()) as any;

    if (!invitation) {
      return NextResponse.json(
        { error: 'Mã mời không tồn tại hoặc không hợp lệ. Hệ thống chỉ cho phép thành viên có thư mời nhập học.' },
        { status: 400 }
      );
    }

    if (invitation.is_revoked === 1) {
      return NextResponse.json({ error: 'Mã mời này đã bị quản trị viên thu hồi.' }, { status: 403 });
    }

    if (invitation.expires_at && new Date(invitation.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'Mã mời này đã hết hạn sử dụng.' }, { status: 403 });
    }

    if (invitation.max_uses && invitation.used_count >= invitation.max_uses) {
      return NextResponse.json({ error: 'Mã mời này đã đạt giới hạn lượt kích hoạt.' }, { status: 403 });
    }

    // Nếu mã mời được gán riêng cho 1 email cụ thể
    if (invitation.assigned_email && invitation.assigned_email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: `Mã mời này chỉ dành riêng cho địa chỉ email: ${invitation.assigned_email}` },
        { status: 403 }
      );
    }

    // 2. Kiểm tra email đã đăng ký chưa
    const existing = db.prepare('SELECT id FROM profiles WHERE lower(email) = lower(?)').get(email);
    if (existing) {
      return NextResponse.json({ error: 'Email này đã được sử dụng. Vui lòng đăng nhập.' }, { status: 400 });
    }

    // 3. Tạo tài khoản trong transaction
    const newUserId = 'usr_' + crypto.randomBytes(6).toString('hex');
    const userRole = invitation.role || 'student';

    db.transaction(() => {
      db.prepare(`
        INSERT INTO profiles (id, email, password_hash, full_name, role, invited_by, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        newUserId,
        email.toLowerCase().trim(),
        hashPassword(password),
        fullName.trim(),
        userRole,
        invitation.created_by,
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      );

      // Cập nhật số lần dùng mã mời
      db.prepare('UPDATE invitations SET used_count = used_count + 1 WHERE id = ?').run(invitation.id);

      // Ghi Audit Log
      const auditId = 'aud_' + crypto.randomBytes(6).toString('hex');
      db.prepare(`
        INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, details)
        VALUES (?, ?, 'USER_REGISTERED_BY_INVITE', 'profile', ?, ?)
      `).run(
        auditId,
        newUserId,
        newUserId,
        JSON.stringify({ invite_code: invitation.code, email })
      );
    })();

    // Tự động đăng nhập
    await setAuthCookie(newUserId);

    return NextResponse.json({
      success: true,
      user: {
        id: newUserId,
        email: email.toLowerCase().trim(),
        full_name: fullName.trim(),
        role: userRole,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi đăng ký tài khoản' }, { status: 500 });
  }
}
