import Link from 'next/link';
import { getDb } from '@/db/schema';
import { seedDatabase } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { checkCourseAccess } from '@/lib/entitlements';
import CourseCard from '@/components/CourseCard';
import { BookOpen, ShieldCheck, Play, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function HomePage() {
  seedDatabase();
  const user = await getCurrentUser();
  const db = getDb();

  const courses = db.prepare(`
    SELECT id, slug, title, subtitle, description, thumbnail_url,
           instructor_name, instructor_title, instructor_avatar,
           category, level, duration_minutes, price,
           demo_5m_title, demo_20m_title
    FROM courses
    WHERE is_published = 1
    ORDER BY created_at DESC
    LIMIT 4
  `).all() as any[];

  const enrichedCourses = courses.map((c) => {
    const access = checkCourseAccess(user?.id || null, c.id);
    return {
      ...c,
      hasAccess: access.hasAccess,
      accessReason: access.reason,
    };
  });

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Nền Tảng Đào Tạo Chuyên Sâu · Chuẩn Mực Học Thuật</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Học Viện Tri Thức Riêng Tư Cho Kỹ Sư & Nhà Lãnh Đạo Công Nghệ
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Không gian học tập độc quyền với các bài giảng chuyên sâu từ các chuyên gia hàng đầu. Mỗi bài học đều có hai video demo độc lập (5 phút & 20 phút) để bạn thẩm định giá trị trước khi quyết định.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/courses"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Khám Phá Thư Viện Bài Giảng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-sm font-medium backdrop-blur-xs transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-300" />
                <span>Nhập Mã Mời Kích Hoạt</span>
              </Link>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2 Video Demo Độc Lập Mỗi Bài</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thanh Toán Tự Động VietQR</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sở Hữu Vĩnh Viễn hoặc Hội Viên</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">Demo Kép 5p & 20p</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Xem thử hai video độc lập: teaser 5 phút tóm lược cốt lõi và bài giảng mẫu 20 phút đi sâu giải pháp thực tế.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">Phòng Học Đẳng Cấp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tích hợp video player lớn, lưu tiến độ theo giây, slide PDF tải về, ghi chú cá nhân và bài tập trắc nghiệm.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">Thương Mại Minh Bạch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tự do mua lẻ sở hữu vĩnh viễn hoặc đăng ký gói hội viên theo tháng/năm. Không ép mua lại nếu đã sở hữu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">Hệ Thống Private</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đăng ký bắt buộc qua mã mời. Bảo mật phân quyền ở tầng backend và ghi audit log cho mọi thay đổi quan trọng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Chương Trình Chọn Lọc
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Các Khóa Học Chuyên Sâu Mới Nhất
              </h2>
            </div>
            <Link
              href="/courses"
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 group self-start md:self-auto"
            >
              <span>Xem tất cả bài giảng trong thư viện</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {enrichedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Invitation Callout */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-800 text-blue-200 uppercase tracking-wider">
                Mã Mời Nhập Học
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Bạn đã nhận được lời mời tham gia?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg leading-relaxed">
                Nhập mã mời của bạn để kích hoạt tài khoản học viên và mở khóa không gian học tập cá nhân. Mã mời mẫu khả dụng cho kỳ học: <span className="font-mono text-blue-300 font-bold">LMS-VIP-2026</span>
              </p>
            </div>
            <Link
              href="/register?code=LMS-VIP-2026"
              className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shrink-0 shadow-lg transition-colors flex items-center gap-2"
            >
              <span>Kích Hoạt Tài Khoản Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
