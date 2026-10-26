import { NextResponse } from 'next/server';
import { getDb } from '@/db/schema';
import { seedDatabase } from '@/db/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const products = db.prepare(`
      SELECT p.*, pe.course_id, c.title as course_title, c.slug as course_slug
      FROM products p
      LEFT JOIN product_entitlements pe ON pe.product_id = p.id
      LEFT JOIN courses c ON pe.course_id = c.id
      WHERE p.is_active = 1
      ORDER BY p.price ASC
    `).all() as any[];

    const formatted = products.map((p) => {
      let features = [];
      try {
        features = JSON.parse(p.features_list || '[]');
      } catch (e) {}
      return {
        ...p,
        features_list: features,
      };
    });

    return NextResponse.json({ products: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
