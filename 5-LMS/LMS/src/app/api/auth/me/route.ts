import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    // Đảm bảo database đã được seed khi server chạy lần đầu
    seedDatabase();

    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
