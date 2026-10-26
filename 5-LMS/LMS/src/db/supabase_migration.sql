-- ==============================================================================
-- POSTGRESQL & SUPABASE MIGRATION SCRIPT FOR LMS PLATFORM
-- Phù hợp triển khai trên Supabase PostgreSQL với Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  bio TEXT,
  invited_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INVITATIONS
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  email TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  role TEXT NOT NULL DEFAULT 'student',
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  thumbnail_url TEXT,
  instructor_name TEXT NOT NULL,
  instructor_title TEXT,
  instructor_avatar TEXT,
  learning_outcomes JSONB DEFAULT '[]'::jsonb,
  target_audience JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'all' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  duration_minutes INT DEFAULT 0,
  price INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  demo_5m_url TEXT,
  demo_5m_title TEXT,
  demo_5m_duration INT DEFAULT 300,
  demo_20m_url TEXT,
  demo_20m_title TEXT,
  demo_20m_duration INT DEFAULT 1200,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COURSE SECTIONS
CREATE TABLE IF NOT EXISTS public.course_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_markdown TEXT,
  video_url TEXT,
  video_duration_seconds INT DEFAULT 0,
  is_free_preview BOOLEAN DEFAULT FALSE,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LESSON RESOURCES
CREATE TABLE IF NOT EXISTS public.lesson_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'slide', 'link', 'code', 'file')),
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('single_course', 'membership_monthly', 'membership_yearly')),
  price INT NOT NULL,
  original_price INT,
  is_active BOOLEAN DEFAULT TRUE,
  features_list JSONB DEFAULT '[]'::jsonb,
  duration_days INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRODUCT ENTITLEMENTS
CREATE TABLE IF NOT EXISTS public.product_entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE
);

-- 9. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  total_amount INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  payment_method TEXT DEFAULT 'vietqr',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  price INT NOT NULL,
  quantity INT DEFAULT 1
);

-- 11. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  transaction_id TEXT UNIQUE,
  gateway TEXT NOT NULL DEFAULT 'sepay_vietqr',
  amount INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
  raw_payload JSONB,
  idempotency_key TEXT UNIQUE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  order_id UUID REFERENCES public.orders(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ENTITLEMENTS
CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  source_type TEXT NOT NULL CHECK (source_type IN ('purchase', 'membership', 'manual_grant', 'free')),
  source_id UUID,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. LESSON PROGRESS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  seconds_watched INT DEFAULT 0,
  total_seconds INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- 15. LESSON NOTES
CREATE TABLE IF NOT EXISTS public.lesson_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  timestamp_seconds INT DEFAULT 0,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. QUIZZES
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID UNIQUE NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INT DEFAULT 80,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. QUIZ QUESTIONS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  explanation TEXT,
  order_index INT DEFAULT 0,
  points INT DEFAULT 10
);

-- 18. QUIZ OPTIONS
CREATE TABLE IF NOT EXISTS public.quiz_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INT DEFAULT 0
);

-- 19. QUIZ ATTEMPTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INT NOT NULL,
  is_passed BOOLEAN NOT NULL,
  answers_payload JSONB,
  attempt_number INT DEFAULT 1,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Profiles: User reads own profile, admin reads all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Notes: User only reads/updates own notes
CREATE POLICY "Users can view own notes" ON public.lesson_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON public.lesson_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Progress: User reads/updates own progress
CREATE POLICY "Users can view own progress" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);
