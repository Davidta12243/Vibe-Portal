import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { hashPassword, setAuthCookie } from '@/lib/auth';
import { seedDatabase } from '@/db/seed';

export async function POST(req: NextRequest) {
  try {
    seedDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng cung cấp email và mật khẩu' }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare(`
      SELECT id, email, password_hash, full_name, avatar_url, role, bio 
      FROM profiles 
      WHERE lower(email) = lower(?)
    `).get(email) as any;

    if (!user) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const hashed = hashPassword(password);
    if (user.password_hash !== hashed) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    await setAuthCookie(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý đăng nhập' }, { status: 500 });
  }
}
