'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  FileText,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-xs text-slate-400">
        Đang tải không gian học tập cá nhân...
      </div>
    );
  }

  if (!data?.profile) {
    return null;
  }

  const { profile, activeSubscription, enrolledCourses, pendingQuizzes, recentResources, nextLessonToContinue } = data;

  return (
    <div className="flex-1 py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <img
              src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={profile.full_name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
            />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                Không Gian Học Tập Cá Nhân
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Xin chào, {profile.full_name}
              </h1>
              <p className="text-xs text-slate-300">
                {profile.email} · Vai trò: {profile.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
              </p>
            </div>
          </div>

          {/* Quick Continue Button */}
          {nextLessonToContinue ? (
            <Link
              href={`/classroom/${nextLessonToContinue.course_slug}/${nextLessonToContinue.lesson_id}`}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2.5 shrink-0 relative z-10"
            >
              <Play className="w-4 h-4 fill-current" />
              <div className="text-left">
                <span className="block text-[10px] text-blue-200 font-normal">Tiếp tục học dở:</span>
                <span className="truncate max-w-[200px] block">{nextLessonToContinue.lesson_title}</span>
              </div>
            </Link>
          ) : (
            <Link
              href="/courses"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Khám phá bài giảng mới
            </Link>
          )}
        </div>

        {/* Membership Badge Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Gói Thành Viên
              </span>
              {activeSubscription ? (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{activeSubscription.product_title}</h4>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    Hạn dùng đến: {new Date(activeSubscription.expires_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Chưa đăng ký gói hội viên</h4>
                  <Link href="/pricing" className="text-[10px] text-blue-600 font-semibold hover:underline">
                    Xem các gói hội viên →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Khóa Học Đang Tham Gia
              </span>
              <h4 className="font-bold text-slate-900 text-xs">{enrolledCourses.length} khóa học sở hữu</h4>
              <p className="text-[10px] text-slate-500">Được cấp quyền truy cập đầy đủ</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-50 text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Bài Tập Cần Hoàn Thành
              </span>
              <h4 className="font-bold text-slate-900 text-xs">{pendingQuizzes.length} bài kiểm tra đang chờ</h4>
              <p className="text-[10px] text-slate-500">Đạt điểm để nhận chứng nhận</p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              Khóa Học & Tiến Độ Đang Theo Học
            </h2>
            <Link href="/courses" className="text-xs text-blue-700 font-semibold hover:underline">
              Tìm thêm khóa học khác →
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">Bạn chưa đăng ký khóa học nào.</p>
              <Link href="/courses" className="mt-3 inline-block px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold">
                Khám phá thư viện bài giảng
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((c: any) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full bg-slate-100">
                    <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                      {c.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">Giảng viên: {c.instructor_name}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Tiến độ</span>
                        <span className="font-bold text-slate-800">{c.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${c.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block text-right">
                        {c.completedLessons} / {c.totalLessons} bài hoàn thành
                      </span>
                    </div>

                    <Link
                      href={`/courses/${c.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Vào Học Tiếp
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lower Grid: Pending Quizzes + Recent Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Quizzes */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              Bài Tập Đang Chờ Đánh Giá
            </h3>
            {pendingQuizzes.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Không có bài tập nào đang chờ hoàn thành!
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingQuizzes.map((qz: any) => (
                  <div
                    key={qz.quiz_id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">{qz.quiz_title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {qz.course_title} · Bài: {qz.lesson_title}
                      </p>
                    </div>
                    <Link
                      href={`/classroom/${qz.course_slug}/${qz.lesson_id}`}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] shrink-0"
                    >
                      Làm bài
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Resources */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Tài Liệu Bài Học Gần Đây
            </h3>
            {recentResources.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có tài liệu nào được mở.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentResources.map((res: any) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{res.title}</p>
                        <p className="text-[10px] text-slate-500">{res.course_title}</p>
                      </div>
                    </div>
                    <a
                      href={res.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                      title="Xem tài liệu"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
