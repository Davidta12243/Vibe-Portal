'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập không thành công');
      }

      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng hoặc máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-6 h-6 text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Đăng Nhập Học Viện
          </h2>
          <p className="text-xs text-slate-500">
            Truy cập nền tảng đào tạo riêng tư VERITAS LMS
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs space-y-2">
          <p className="font-semibold text-blue-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Tài Khoản Thử Nghiệm Nhanh
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickAccount('student@lms.edu.vn', 'student123')}
              className="py-2 px-2.5 rounded-lg bg-white hover:bg-blue-100/50 border border-blue-200 text-blue-900 font-medium text-[11px] text-center transition-colors"
            >
              Học Viên Demo
            </button>
            <button
              type="button"
              onClick={() => fillQuickAccount('admin@lms.edu.vn', 'admin123')}
              className="py-2 px-2.5 rounded-lg bg-white hover:bg-blue-100/50 border border-blue-200 text-blue-900 font-medium text-[11px] text-center transition-colors"
            >
              Quản Trị Viên Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tenban@lms.edu.vn"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-blue-900 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Chưa có tài khoản? </span>
          <Link href="/register" className="font-semibold text-blue-700 hover:underline">
            Kích hoạt bằng mã mời
          </Link>
        </div>
      </div>
    </div>
  );
}
