'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VietQrModal from '@/components/VietQrModal';
import { CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowRight, Clock, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = async (product: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        alert(data.error || 'Có lỗi xảy ra');
        return;
      }

      setSelectedOrderCode(data.order.orderCode);
      setSelectedAmount(data.order.totalAmount);
      setSelectedTitle(data.order.productTitle);
      setCheckoutModalOpen(true);
    } catch (e: any) {
      alert(e.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsProcessing(false);
    }
  };

  const membershipPlans = products.filter(
    (p) => p.type === 'membership_monthly' || p.type === 'membership_yearly'
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="flex-1 py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            Chính Sách & Gói Thành Viên
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Linh Hoạt Mua Lẻ Hoặc Tham Gia Gói Hội Viên
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Không có chi phí ẩn. Người mua lẻ được sở hữu vĩnh viễn nội dung đã mua. Thành viên được mở khóa toàn bộ kho tàng tri thức trong suốt thời gian gói hiệu lực.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 items-stretch">
          {membershipPlans.map((plan) => {
            const isYearly = plan.type === 'membership_yearly';
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isYearly
                    ? 'bg-slate-900 text-white shadow-2xl border-2 border-blue-500/80 ring-4 ring-blue-500/20'
                    : 'bg-white text-slate-900 shadow-lg border border-slate-200'
                }`}
              >
                {isYearly && (
                  <div className="absolute -top-3.5 right-8 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider shadow-md">
                    Tiết kiệm 35% · Khuyên Dùng
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <p className={`text-xs mt-1 ${isYearly ? 'text-slate-300' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                      {formatPrice(plan.price)}
                    </span>
                    <span className={`text-xs ${isYearly ? 'text-slate-400' : 'text-slate-500'}`}>
                      / {isYearly ? 'năm (365 ngày)' : 'tháng (30 ngày)'}
                    </span>
                  </div>

                  {plan.original_price && (
                    <div className="text-xs text-slate-400 line-through">
                      Giá gốc: {formatPrice(plan.original_price)}
                    </div>
                  )}

                  {/* Feature checklist */}
                  <div className="space-y-3 pt-6 border-t border-slate-200/20 text-xs">
                    <span className="font-semibold block uppercase tracking-wider text-[11px]">
                      Quyền lợi bao gồm:
                    </span>
                    {plan.features_list?.map((feat: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isYearly ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        />
                        <span className={`leading-relaxed ${isYearly ? 'text-slate-200' : 'text-slate-700'}`}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isProcessing}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                      isYearly
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Đăng Ký {plan.title}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
          <h3 className="font-bold text-base text-slate-900">
            So Sánh Chi Tiết Quyền Lợi Các Mô Hình
          </h3>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Quyền Lợi</th>
                  <th className="py-3 px-4 text-center">Mua Lẻ Từng Khóa</th>
                  <th className="py-3 px-4 text-center">Gói Tháng</th>
                  <th className="py-3 px-4 text-center text-blue-700 font-bold">Gói Năm (Toàn Diện)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-4 font-medium">Thời hạn quyền truy cập</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">Vĩnh viễn trọn đời</td>
                  <td className="py-3.5 px-4 text-center">30 ngày</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-blue-700">365 ngày</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Số lượng khóa học truy cập</td>
                  <td className="py-3.5 px-4 text-center">Khóa đã mua</td>
                  <td className="py-3.5 px-4 text-center font-semibold">Toàn bộ thư viện</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-blue-700">Toàn bộ + Khóa mới phát hành</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Hai video demo miễn phí (5p & 20p)</td>
                  <td className="py-3.5 px-4 text-center">✓ Đầy đủ</td>
                  <td className="py-3.5 px-4 text-center">✓ Đầy đủ</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-700">✓ Đầy đủ</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Tải slide PDF và source code mẫu</td>
                  <td className="py-3.5 px-4 text-center">✓</td>
                  <td className="py-3.5 px-4 text-center">✓</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-700">✓</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Làm bài tập trắc nghiệm có chứng chỉ</td>
                  <td className="py-3.5 px-4 text-center">✓</td>
                  <td className="py-3.5 px-4 text-center">✓</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-700">✓ Ưu tiên cấp mã xác thực</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Giữ quyền mua lẻ khi hết hạn gói</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">✓ Tuyệt đối độc lập</td>
                  <td className="py-3.5 px-4 text-center">✓ Giữ nguyên khóa mua lẻ</td>
                  <td className="py-3.5 px-4 text-center font-bold text-blue-700">✓ Giữ nguyên khóa mua lẻ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VietQR Checkout Modal */}
      <VietQrModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        orderCode={selectedOrderCode}
        totalAmount={selectedAmount}
        productTitle={selectedTitle}
      />
    </div>
  );
}
