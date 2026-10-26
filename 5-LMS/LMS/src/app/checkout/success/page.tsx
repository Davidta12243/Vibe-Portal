'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, BookOpen, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    if (orderCode) {
      fetch(`/api/orders/${orderCode}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.order) setOrder(data.order);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderCode]);

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider inline-block">
            Xác Nhận Thành Công
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Thanh Toán Đã Hoàn Tất!
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hệ thống đã tự động cấp quyền truy cập vào tài khoản học viên của bạn. Bạn có thể bắt đầu học ngay bây giờ.
          </p>
        </div>

        {order && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Mã đơn hàng:</span>
              <span className="font-mono font-bold text-slate-900">{order.order_code}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Sản phẩm:</span>
              <span className="font-semibold text-slate-800">{order.product_title}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Số tiền đã thanh toán:</span>
              <span className="font-bold text-blue-700">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total_amount)}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2.5 pt-2">
          <Link
            href="/dashboard"
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Đến Không Gian Học Tập</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/courses"
            className="w-full py-2.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors block"
          >
            Khám phá thêm các bài giảng khác
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-xs text-slate-400">Đang tải kết quả giao dịch...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
