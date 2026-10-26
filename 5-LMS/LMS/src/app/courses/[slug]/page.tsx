'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import VietQrModal from '@/components/VietQrModal';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Award,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutOrderCode, setCheckoutOrderCode] = useState('');
  const [checkoutAmount, setCheckoutAmount] = useState(0);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const handleBuyCourse = async () => {
    setIsCreatingOrder(true);
    try {
      // 1. Tìm product tương ứng với khóa học này
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      const matchedProd = prodData.products?.find(
        (p: any) => p.type === 'single_course' && p.course_id === course.id
      );

      if (!matchedProd) {
        alert('Chưa có gói sản phẩm cho khóa học này');
        return;
      }

      // 2. Tạo đơn hàng từ server
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: matchedProd.id }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        if (orderRes.status === 401) {
          router.push('/login');
          return;
        }
        alert(orderData.error || 'Lỗi khi tạo đơn hàng');
        return;
      }

      setCheckoutOrderCode(orderData.order.orderCode);
      setCheckoutAmount(orderData.order.totalAmount);
      setCheckoutModalOpen(true);
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Đang tải thông tin bài giảng...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy khóa học</h2>
        <Link href="/courses" className="text-xs text-blue-700 underline font-medium">
          Quay lại thư viện bài giảng
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Tìm bài học đầu tiên để nút "Vào Học" dẫn tới
  const firstLessonId = course.sections?.[0]?.lessons?.[0]?.id;

  return (
    <div className="flex-1 py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/courses" className="hover:text-blue-700">Thư Viện Khóa Học</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-medium">{course.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{course.title}</span>
        </div>

        {/* Top Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Course Main Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold">
                  {course.category}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {Math.round(course.duration_minutes / 60)} giờ học chuyên sâu
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                  {course.subtitle}
                </p>
              )}
            </div>

            {/* Instructor Card */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200">
              <img
                src={course.instructor_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={course.instructor_name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                  Giảng viên chuyên gia
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{course.instructor_name}</h4>
                <p className="text-xs text-slate-500">{course.instructor_title}</p>
              </div>
            </div>

            {/* Two Independent Demo Videos Section */}
            <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-600 fill-current" />
                    Hai Video Demo Độc Lập Xem Trước
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bạn có thể chọn xem Teaser 5 phút hoặc Bài giảng chuyên sâu 20 phút mà không bị ép buộc theo thứ tự.
                  </p>
                </div>
              </div>

              {/* Embedded Video Player with Demo switchers */}
              <VideoPlayer
                demo5mUrl={course.demo_5m_url}
                demo5mTitle={course.demo_5m_title}
                demo20mUrl={course.demo_20m_url}
                demo20mTitle={course.demo_20m_title}
                hasFullAccess={course.hasAccess}
                lessonTitle={course.title}
              />
            </div>

            {/* Learning Outcomes */}
            {course.learning_outcomes?.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Kiến Thức & Kỹ Năng Đạt Được
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {course.learning_outcomes.map((outcome: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-relaxed">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Purchase Card (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-lg space-y-6">
              {/* Thumbnail preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.hasAccess && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-md bg-emerald-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã sở hữu
                  </div>
                )}
              </div>

              {/* Price / Access Status */}
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Chính sách truy cập
                </span>
                {course.hasAccess ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                    <p className="font-bold">Bạn đã có toàn quyền truy cập bài giảng này</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      {course.accessReason === 'purchase'
                        ? 'Quyền sở hữu mua lẻ vĩnh viễn.'
                        : course.accessReason === 'membership'
                        ? 'Được cấp qua gói Hội viên đang hiệu lực.'
                        : 'Quyền quản trị viên.'}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {formatPrice(course.price)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(course.price * 1.4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {course.hasAccess ? (
                  <Link
                    href={`/classroom/${course.id}/${firstLessonId}`}
                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Vào Học Ngay
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleBuyCourse}
                      disabled={isCreatingOrder}
                      className="w-full py-3.5 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {isCreatingOrder ? 'Đang tạo đơn hàng...' : `Mua Bài Giảng Này (${formatPrice(course.price)})`}
                    </button>

                    <Link
                      href="/pricing"
                      className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Hoặc Đăng Ký Gói Hội Viên (Từ 490k/tháng)
                    </Link>
                  </>
                )}
              </div>

              {/* Guarantee list */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Sở hữu trọn đời không giới hạn thời gian (khi mua lẻ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Tài liệu slide PDF và mã nguồn mẫu tải về</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Làm bài kiểm tra trắc nghiệm chấm điểm tự động</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Section (Lộ trình chi tiết) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
                Giáo Trình Giảng Dạy
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Cấu Trúc Các Chương & Bài Học
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {course.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0)} bài học
            </span>
          </div>

          <div className="space-y-4">
            {course.sections?.map((section: any, sIdx: number) => (
              <div key={section.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100/70 p-4 font-semibold text-xs text-slate-900 flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="text-slate-500 font-normal">{section.lessons?.length || 0} bài</span>
                </div>

                <div className="divide-y divide-slate-100 bg-white text-xs">
                  {section.lessons?.map((lesson: any, lIdx: number) => {
                    const isUnlocked = course.hasAccess || lesson.is_free_preview;
                    return (
                      <div
                        key={lesson.id}
                        className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center shrink-0">
                            {lIdx + 1}
                          </span>
                          <div>
                            <p className="font-medium text-slate-900">{lesson.title}</p>
                            {lesson.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {lesson.is_free_preview && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Học thử miễn phí
                            </span>
                          )}

                          <span className="font-mono text-[11px] text-slate-400">
                            {Math.round(lesson.video_duration_seconds / 60)} phút
                          </span>

                          {isUnlocked ? (
                            <Link
                              href={`/classroom/${course.id}/${lesson.id}`}
                              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center gap-1 transition-colors"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              Học
                            </Link>
                          ) : (
                            <span className="p-1.5 text-slate-400" title="Bài học bị khóa. Vui lòng đăng ký để mở khóa.">
                              <Lock className="w-4 h-4" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout VietQR Modal */}
      <VietQrModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        orderCode={checkoutOrderCode}
        totalAmount={checkoutAmount}
        productTitle={course.title}
      />
    </div>
  );
}
