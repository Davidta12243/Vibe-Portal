import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Xác định đường dẫn có quyền ghi (tránh lỗi EROFS trên Vercel Serverless)
function resolveDbPath(): string {
  // Nếu đang chạy trên Vercel, AWS Lambda hoặc môi trường serverless
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION) {
    return path.join(os.tmpdir(), 'lms.db');
  }

  // Môi trường local development
  try {
    const dbDirectory = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory, { recursive: true });
    }
    return path.join(dbDirectory, 'lms.db');
  } catch {
    // Fallback nếu thư mục gốc bị khóa chỉ đọc
    return path.join(os.tmpdir(), 'lms.db');
  }
}

// Khởi tạo SQLite kết nối singleton
let dbInstance: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!dbInstance) {
    const dbPath = resolveDbPath();
    dbInstance = new Database(dbPath);
    try {
      dbInstance.pragma('journal_mode = WAL');
    } catch {
      dbInstance.pragma('journal_mode = DELETE');
    }
    dbInstance.pragma('foreign_keys = ON');
    initTables(dbInstance);
  }
  return dbInstance;
}


function initTables(db: Database.Database) {
  db.exec(`
    -- 1. Profiles (Tài khoản người dùng)
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('admin', 'student')),
      bio TEXT,
      invited_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Invitations (Lời mời vào hệ thống Private)
    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      email TEXT,
      created_by TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      max_uses INTEGER DEFAULT 1,
      used_count INTEGER DEFAULT 0,
      expires_at DATETIME,
      is_revoked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES profiles(id)
    );

    -- 3. Courses (Khóa học / Bài giảng)
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT NOT NULL,
      thumbnail_url TEXT,
      instructor_name TEXT NOT NULL,
      instructor_title TEXT,
      instructor_avatar TEXT,
      learning_outcomes TEXT, -- JSON array
      target_audience TEXT,   -- JSON array
      category TEXT NOT NULL,
      level TEXT NOT NULL DEFAULT 'all' CHECK(level IN ('beginner', 'intermediate', 'advanced', 'all')),
      duration_minutes INTEGER DEFAULT 0,
      price INTEGER DEFAULT 0, -- Giá mua lẻ (VNĐ)
      is_published INTEGER DEFAULT 1,
      demo_5m_url TEXT,
      demo_5m_title TEXT,
      demo_5m_duration INTEGER DEFAULT 300,
      demo_20m_url TEXT,
      demo_20m_title TEXT,
      demo_20m_duration INTEGER DEFAULT 1200,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Course Sections (Chương học)
    CREATE TABLE IF NOT EXISTS course_sections (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 5. Lessons (Bài học)
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      section_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content_markdown TEXT,
      video_url TEXT,
      video_duration_seconds INTEGER DEFAULT 0,
      is_free_preview INTEGER DEFAULT 0,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE
    );

    -- 6. Lesson Resources (Tài liệu đính kèm)
    CREATE TABLE IF NOT EXISTS lesson_resources (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      title TEXT NOT NULL,
      resource_type TEXT NOT NULL CHECK(resource_type IN ('pdf', 'slide', 'link', 'code', 'file')),
      file_url TEXT NOT NULL,
      file_size_bytes INTEGER,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    -- 7. Products (Sản phẩm kinh doanh: Khóa học đơn lẻ hoặc Gói thành viên)
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('single_course', 'membership_monthly', 'membership_yearly')),
      price INTEGER NOT NULL, -- VNĐ
      original_price INTEGER,
      is_active INTEGER DEFAULT 1,
      features_list TEXT, -- JSON array
      duration_days INTEGER, -- NULL nếu vĩnh viễn
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 8. Product Entitlements (Liên kết Sản phẩm -> Quyền hạn)
    CREATE TABLE IF NOT EXISTS product_entitlements (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      course_id TEXT, -- NULL nghĩa là áp dụng cho toàn bộ khóa học (gói membership)
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 9. Orders (Đơn hàng)
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_code TEXT UNIQUE NOT NULL, -- Mã tra cứu duy nhất: LMS-ORD-xxxxxx
      user_id TEXT NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
      payment_method TEXT DEFAULT 'vietqr',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id)
    );

    -- 10. Order Items (Chi tiết đơn hàng)
    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      price INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    -- 11. Payments (Giao dịch thanh toán)
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      transaction_id TEXT UNIQUE, -- Mã giao dịch từ cổng/ngân hàng
      gateway TEXT NOT NULL DEFAULT 'sepay_vietqr',
      amount INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'success', 'failed')),
      raw_payload TEXT, -- JSON phản hồi từ Webhook
      idempotency_key TEXT UNIQUE,
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    -- 12. Subscriptions (Gói thành viên theo kỳ hạn)
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      order_id TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'expired', 'cancelled')),
      starts_at DATETIME NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );

    -- 13. Entitlements (Quyền truy cập thực tế của người dùng)
    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      source_type TEXT NOT NULL CHECK(source_type IN ('purchase', 'membership', 'manual_grant', 'free')),
      source_id TEXT, -- Order ID, Subscription ID hoặc Admin Profile ID
      expires_at DATETIME, -- NULL nếu vĩnh viễn (khi mua lẻ)
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    -- 14. Lesson Progress (Tiến độ học tập từng bài học)
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      seconds_watched INTEGER DEFAULT 0,
      total_seconds INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      last_watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES profiles(id),
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- 15. Lesson Notes (Ghi chú cá nhân của người học)
    CREATE TABLE IF NOT EXISTS lesson_notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      timestamp_seconds INTEGER DEFAULT 0,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id),
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    -- 16. Quizzes (Bài tập trắc nghiệm gắn với bài học)
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      lesson_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      passing_score INTEGER DEFAULT 80, -- Điểm đạt %
      max_attempts INTEGER DEFAULT 3,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    -- 17. Quiz Questions (Câu hỏi trắc nghiệm)
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      explanation TEXT,
      order_index INTEGER DEFAULT 0,
      points INTEGER DEFAULT 10,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- 18. Quiz Options (Đáp án trắc nghiệm)
    CREATE TABLE IF NOT EXISTS quiz_options (
      id TEXT PRIMARY KEY,
      question_id TEXT NOT NULL,
      option_text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0, -- 1 hoặc 0 (chỉ server biết, không trả trước cho client)
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
    );

    -- 19. Quiz Attempts (Lịch sử làm bài tập của học viên)
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      is_passed INTEGER NOT NULL,
      answers_payload TEXT, -- JSON câu trả lời
      attempt_number INTEGER DEFAULT 1,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES profiles(id),
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- 20. Audit Logs (Nhật ký kiểm toán thao tác quản trị)
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT,
      details TEXT, -- JSON chi tiết
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES profiles(id)
    );

    -- Tạo Indexes tối ưu hóa truy vấn
    CREATE INDEX IF NOT EXISTS idx_entitlements_user ON entitlements(user_id, is_active);
    CREATE INDEX IF NOT EXISTS idx_progress_user_course ON lesson_progress(user_id, course_id);
    CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);
    CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);
    CREATE INDEX IF NOT EXISTS idx_payments_idempotency ON payments(idempotency_key);
  `);
}
