'use client';

import Link from 'next/link';
import { Clock, Play, CheckCircle, Lock, BookOpen } from 'lucide-react';

export interface CourseData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail_url: string;
  instructor_name: string;
  instructor_title?: string;
  instructor_avatar?: string;
  category: string;
  level: string;
  duration_minutes: number;
  price: number;
  hasAccess?: boolean;
  accessReason?: string;
  demo_5m_title?: string;
  demo_20m_title?: string;
}

export default function CourseCard({ course }: { course: CourseData }) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const levelLabels: Record<string, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao',
    all: 'Mọi trình độ',
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
      {/* Thumbnail Banner with badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
            {course.category}
          </span>

          {course.hasAccess ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Đã sở hữu
            </span>
          ) : course.price === 0 ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Miễn phí
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-blue-900/90 text-white backdrop-blur-xs">
              {formatPrice(course.price)}
            </span>
          )}
        </div>

        {/* Demo Indicator Badges */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-xs flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current text-blue-400" /> Demo 5p
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-white border border-white/20 backdrop-blur-xs flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current text-indigo-400" /> Demo 20p
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
          <span className="font-medium text-slate-600">{levelLabels[course.level] || 'Tất cả'}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {Math.round(course.duration_minutes / 60)} giờ học
          </span>
        </div>

        <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
          <Link href={`/courses/${course.slug}`}>{course.title}</Link>
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 mb-4">
          <img
            src={course.instructor_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
            alt={course.instructor_name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-800 leading-tight">{course.instructor_name}</span>
            <span className="text-[10px] text-slate-400">{course.instructor_title || 'Giảng viên chuyên môn'}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {course.hasAccess ? (
            <Link
              href={`/courses/${course.slug}`}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Vào Học Ngay
            </Link>
          ) : (
            <Link
              href={`/courses/${course.slug}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-slate-300" />
              Xem Bài Giảng & Video Demo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
