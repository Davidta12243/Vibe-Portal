'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Shield, User, LogOut, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CurrentUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'student';
  avatar_url?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setDropdownOpen(false);
    router.push('/login');
    router.refresh();
  };

  const handleQuickSwitch = async (targetRole: 'admin' | 'student') => {
    const email = targetRole === 'admin' ? 'admin@lms.edu.vn' : 'student@lms.edu.vn';
    const password = targetRole === 'admin' ? 'admin123' : 'student123';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setDropdownOpen(false);
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-blue-900 transition-colors">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                VERITAS LMS
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  Private
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Academic Learning</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link
              href="/courses"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith('/courses') ? 'text-blue-700 bg-blue-50/80 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Thư Viện Bài Giảng
            </Link>
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/pricing' ? 'text-blue-700 bg-blue-50/80 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Gói Thành Viên
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/dashboard' ? 'text-blue-700 bg-blue-50/80 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                Không Gian Học Tập
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/admin') ? 'text-blue-700 bg-blue-50/80 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Quản Trị Viên
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Profile / Login */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => handleQuickSwitch('student')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                user?.role === 'student' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chuyển nhanh sang tài khoản Học viên"
            >
              Học viên demo
            </button>
            <button
              onClick={() => handleQuickSwitch('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                user?.role === 'admin' ? 'bg-white shadow-xs text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chuyển nhanh sang tài khoản Quản trị viên"
            >
              <Shield className="w-3 h-3 text-blue-600" />
              Admin demo
            </button>
          </div>

          {!loading && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">{user.full_name}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{user.full_name}</p>
                    <p className="text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Tiến Độ & Khóa Học Của Tôi
                  </Link>
                  <Link
                    href="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Lịch Sử Đơn Hàng & Giao Dịch
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-blue-700 font-medium border-t border-slate-100"
                    >
                      <Shield className="w-4 h-4" />
                      Trang Quản Trị Hệ Thống
                    </Link>
                  )}
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng Xuất
                  </button>
                </div>
              )}
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-all"
              >
                Nhập Mã Mời
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
