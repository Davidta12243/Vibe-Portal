import { NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();

    const logs = db.prepare(`
      SELECT a.*, p.full_name as admin_name, p.email as admin_email
      FROM audit_logs a
      LEFT JOIN profiles p ON a.admin_id = p.id
      ORDER BY a.created_at DESC
      LIMIT 100
    `).all();

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
