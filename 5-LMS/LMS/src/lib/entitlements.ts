import { getDb } from '@/db/schema';

export interface AccessResult {
  hasAccess: boolean;
  reason: 'admin' | 'free' | 'purchase' | 'membership' | 'manual_grant' | 'none';
  expiresAt: string | null;
}

/**
 * Kiểm tra quyền truy cập của User đối với một Khóa học
 */
export function checkCourseAccess(userId: string | null, courseId: string): AccessResult {
  if (!userId) {
    return { hasAccess: false, reason: 'none', expiresAt: null };
  }

  const db = getDb();

  // 1. Kiểm tra nếu là Admin
  const user = db.prepare('SELECT role FROM profiles WHERE id = ?').get(userId) as { role: string } | undefined;
  if (user && user.role === 'admin') {
    return { hasAccess: true, reason: 'admin', expiresAt: null };
  }

  // 2. Kiểm tra nếu khóa học miễn phí (price = 0)
  const course = db.prepare('SELECT price FROM courses WHERE id = ?').get(courseId) as { price: number } | undefined;
  if (course && course.price === 0) {
    return { hasAccess: true, reason: 'free', expiresAt: null };
  }

  // 3. Kiểm tra quyền trực tiếp (Mua lẻ vĩnh viễn hoặc Cấp thủ công)
  const directEntitlement = db.prepare(`
    SELECT source_type, expires_at 
    FROM entitlements 
    WHERE user_id = ? AND course_id = ? AND is_active = 1
      AND (expires_at IS NULL OR expires_at > datetime('now'))
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(userId, courseId) as { source_type: string; expires_at: string | null } | undefined;

  if (directEntitlement) {
    return {
      hasAccess: true,
      reason: directEntitlement.source_type as any,
      expiresAt: directEntitlement.expires_at,
    };
  }

  // 4. Kiểm tra gói Hội viên (Active Membership Subscriptions)
  const activeSub = db.prepare(`
    SELECT s.expires_at, pe.course_id
    FROM subscriptions s
    JOIN products p ON s.product_id = p.id
    JOIN product_entitlements pe ON pe.product_id = p.id
    WHERE s.user_id = ? 
      AND s.status = 'active' 
      AND s.expires_at > datetime('now')
      AND (pe.course_id IS NULL OR pe.course_id = ?)
    LIMIT 1
  `).get(userId, courseId) as { expires_at: string; course_id: string | null } | undefined;

  if (activeSub) {
    return {
      hasAccess: true,
      reason: 'membership',
      expiresAt: activeSub.expires_at,
    };
  }

  return { hasAccess: false, reason: 'none', expiresAt: null };
}

/**
 * Kiểm tra quyền truy cập của User đối với một Bài học cụ thể
 */
export function checkLessonAccess(userId: string | null, lessonId: string): AccessResult & { isFreePreview: boolean } {
  const db = getDb();
  const lesson = db.prepare(`
    SELECT l.is_free_preview, s.course_id 
    FROM lessons l
    JOIN course_sections s ON l.section_id = s.id
    WHERE l.id = ?
  `).get(lessonId) as { is_free_preview: number; course_id: string } | undefined;

  if (!lesson) {
    return { hasAccess: false, reason: 'none', expiresAt: null, isFreePreview: false };
  }

  // Nếu bài học cho phép xem thử miễn phí
  if (lesson.is_free_preview === 1) {
    return { hasAccess: true, reason: 'free', expiresAt: null, isFreePreview: true };
  }

  // Nếu không, kiểm tra quyền của khóa học
  const courseAccess = checkCourseAccess(userId, lesson.course_id);
  return {
    ...courseAccess,
    isFreePreview: false,
  };
}
