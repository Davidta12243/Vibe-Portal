'use client';

import { useState, useEffect } from 'react';
import CourseCard, { CourseData } from '@/components/CourseCard';
import { Search, Filter, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'owned' | 'free'

  const categories = [
    'Tất Cả Danh Mục',
    'Trí Tuệ Nhân Tạo (AI)',
    'Kỹ Thuật Phần Mềm',
    'Phát Triển Web',
    'Thiết Kế Sản Phẩm',
  ];

  const levels = [
    { id: 'all', label: 'Mọi trình độ' },
    { id: 'beginner', label: 'Cơ bản' },
    { id: 'intermediate', label: 'Trung cấp' },
    { id: 'advanced', label: 'Nâng cao' },
  ];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory && selectedCategory !== 'Tất Cả Danh Mục') params.set('category', selectedCategory);
      if (selectedLevel !== 'all') params.set('level', selectedLevel);
      if (filterType !== 'all') params.set('filterType', filterType);

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel, filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="flex-1 py-10 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-8 space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            Thư Viện Bài Giảng Học Thuật
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Khám Phá Các Khóa Học Chuyên Sâu
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Mỗi bài giảng đều đi kèm hai video demo độc lập (5 phút & 20 phút) để bạn xem trước nội dung và phương pháp giảng dạy.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-8 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm theo tên khóa học, mô tả hoặc giảng viên..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-medium text-xs shadow-xs transition-colors shrink-0"
            >
              Tìm Kiếm
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
            {/* Category Select */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => {
                const isActive = (cat === 'Tất Cả Danh Mục' && !selectedCategory) || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === 'Tất Cả Danh Mục' ? '' : cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border border-blue-200 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Level & Ownership filter */}
            <div className="flex items-center gap-3 shrink-0">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
              >
                {levels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.label}
                  </option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium"
              >
                <option value="all">Tất cả quyền truy cập</option>
                <option value="owned">Đã sở hữu</option>
                <option value="free">Bài học miễn phí</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="aspect-video bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-8 bg-slate-100 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 text-sm">Không tìm thấy bài giảng phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh các bộ lọc phân loại.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
