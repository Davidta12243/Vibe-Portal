import { cookies } from 'next/headers';
import { getDb } from '@/db/schema';
import crypto from 'crypto';

export interface UserSession {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'student';
  bio?: string;
}

const SESSION_COOKIE_NAME = 'lms_auth_session';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'lms_secret_salt_2026').digest('hex');
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  try {
    const [userId, sign] = sessionToken.split('.');
    if (!userId || !sign) return null;

    // Xác thực chữ ký token
    const expectedSign = crypto.createHmac('sha256', 'lms_secret_hmac_key').update(userId).digest('hex');
    if (sign !== expectedSign) return null;

    const db = getDb();
    const user = db.prepare('SELECT id, email, full_name, avatar_url, role, bio FROM profiles WHERE id = ?').get(userId) as UserSession | undefined;
    return user || null;
  } catch {
    return null;
  }
}

export function createSessionToken(userId: string): string {
  const sign = crypto.createHmac('sha256', 'lms_secret_hmac_key').update(userId).digest('hex');
  return `${userId}.${sign}`;
}

export async function setAuthCookie(userId: string) {
  const token = createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin(): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('FORBIDDEN_ADMIN_ONLY');
  }
  return user;
}
