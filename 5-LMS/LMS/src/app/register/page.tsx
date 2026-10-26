'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Lock, Mail, User, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      setInviteCode(codeParam.toUpperCase());
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, inviteCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký không thành công');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng hoặc máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center mx-auto shadow-sm">
            <KeyRound className="w-6 h-6 text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Kích Hoạt Tài Khoản Nhập Học
          </h2>
          <p className="text-xs text-slate-500">
            Hệ thống đào tạo riêng tư chỉ dành cho thành viên có mã mời
          </p>
        </div>

        {/* Private Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[11px] uppercase tracking-wider text-amber-800">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Chế độ Private Access
          </div>
          <p className="text-amber-800 text-[11px] leading-relaxed">
            Hệ thống không cho phép đăng ký tự do. Nếu bạn chưa có mã mời, hãy liên hệ giảng viên hoặc ban quản trị. Mã mời mẫu khả dụng: <button type="button" onClick={() => setInviteCode('LMS-VIP-2026')} className="font-mono font-bold underline text-blue-700">LMS-VIP-2026</button>
          </p>
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
            <label className="block font-medium text-slate-700 mb-1">Mã Lời Mời (Bắt buộc)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-blue-600 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="VD: LMS-VIP-2026"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-blue-300 font-mono font-bold uppercase focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-blue-50/30 text-blue-950"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Họ và Tên</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn An"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hocvien@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Mật khẩu khởi tạo</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Đang xác minh mã mời...' : 'Xác Nhận & Tạo Tài Khoản'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Đã có tài khoản? </span>
          <Link href="/login" className="font-semibold text-blue-700 hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Đang tải biểu mẫu...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
