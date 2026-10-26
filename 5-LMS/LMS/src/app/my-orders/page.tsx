'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats') // hoặc lấy đơn hàng của user
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.recentOrders) {
          setOrders(data.recentOrders);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex-1 py-10 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-1">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            Lịch Sử Giao Dịch
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Đơn Hàng & Thanh Toán Của Tôi
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi trạng thái các hóa đơn mua khóa học và đăng ký gói hội viên
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Đang tải lịch sử giao dịch...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-3">
              <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Bạn chưa có giao dịch thanh toán nào.</p>
              <Link href="/courses" className="inline-block px-4 py-2 rounded-xl bg-blue-700 text-white font-medium">
                Khám phá khóa học
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="py-3.5 px-4">Mã Đơn</th>
                    <th className="py-3.5 px-4">Sản Phẩm</th>
                    <th className="py-3.5 px-4">Số Tiền</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-4">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {ord.order_code}
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {ord.product_title}
                      </td>
                      <td className="py-4 px-4 font-bold text-blue-700">
                        {formatPrice(ord.total_amount)}
                      </td>
                      <td className="py-4 px-4">
                        {ord.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã thanh toán
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Chờ thanh toán
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(ord.created_at).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Guidance for Delayed Payment */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Hướng Dẫn Xử Lý Khi Giao Dịch Chậm
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">1. Kiểm tra nội dung chuyển</span>
              <p className="leading-relaxed">
                Đảm bảo bạn đã nhập chính xác mã đơn hàng (VD: <span className="font-mono text-blue-700 font-semibold">LMS-ORD-...</span>) vào lời nhắn chuyển khoản ngân hàng.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">2. Thời gian xử lý tự động</span>
              <p className="leading-relaxed">
                Cổng VietQR NAPAS 247 thường xử lý trong 5-15 giây. Trong một số khung giờ cao điểm của liên ngân hàng, có thể mất từ 1-3 phút.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-800 block text-xs">3. Hỗ trợ đối soát trực tiếp</span>
              <p className="leading-relaxed">
                Nếu quá 10 phút chưa được kích hoạt, vui lòng gửi biên lai chuyển khoản tới ban quản trị qua email: <span className="text-blue-700 font-semibold">support@lms.edu.vn</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
