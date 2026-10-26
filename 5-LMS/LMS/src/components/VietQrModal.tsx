'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Copy, Check, Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { BANK_CONFIG, generateVietQrUrl } from '@/lib/payment-config';

interface VietQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  totalAmount: number;
  productTitle: string;
}

export default function VietQrModal({
  isOpen,
  onClose,
  orderCode,
  totalAmount,
  productTitle,
}: VietQrModalProps) {
  const router = useRouter();
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút

  const qrImageUrl = generateVietQrUrl(totalAmount, orderCode);

  // Đếm ngược 15 phút
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Polling kiểm tra trạng thái đơn hàng định kỳ mỗi 3 giây
  useEffect(() => {
    if (!isOpen || !orderCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order && data.order.status === 'paid') {
            clearInterval(interval);
            router.push(`/checkout/success?orderCode=${orderCode}`);
          }
        }
      } catch (e) {
        // ignore polling errors
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, orderCode, router]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'acc' | 'content') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  // Giả lập webhook ngân hàng (Sandbox Mode)
  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode,
          amount: totalAmount,
          transactionId: 'SANDBOX_TX_' + Date.now(),
          gateway: 'sepay_sandbox',
        }),
      });

      if (res.ok) {
        router.push(`/checkout/success?orderCode=${orderCode}`);
      } else {
        alert('Lỗi xác nhận thanh toán giả lập');
      }
    } catch (e) {
      alert('Không thể kết nối API webhook');
    } finally {
      setIsSimulating(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Thanh Toán Chuyển Khoản VietQR</h3>
              <p className="text-[11px] text-slate-300">Tự động kích hoạt quyền học tập ngay tức thì</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Order Brief */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-5 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Sản phẩm:</span>
              <span className="font-semibold text-slate-900">{productTitle}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[11px]">Tổng thanh toán:</span>
              <span className="font-bold text-sm text-blue-700">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 mb-5">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 mb-2">
              <img
                src={qrImageUrl}
                alt={`VietQR - ${orderCode}`}
                className="w-48 h-48 object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Thời gian giữ đơn:</span>
              <span className="font-mono font-bold text-slate-800">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Bank Transfer Details with Copy */}
          <div className="space-y-2 text-xs mb-6">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Ngân hàng:</span>
              <span className="font-semibold text-slate-800">MBBank (Ngân Hàng Quân Đội)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">{BANK_CONFIG.accountNo}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(BANK_CONFIG.accountNo, 'acc')}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                  title="Sao chép số tài khoản"
                >
                  {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
              <span className="text-blue-900 font-medium">Nội dung chuyển khoản (bắt buộc):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-900">{orderCode}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(orderCode, 'content')}
                  className="p-1 hover:bg-blue-100 rounded text-blue-700"
                  title="Sao chép mã đơn"
                >
                  {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Sandbox Test Mode Button */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
                Môi Trường Thử Nghiệm Sandbox
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-medium">
                Testing
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mb-3 leading-relaxed">
              Bạn có thể nhấn nút dưới đây để giả lập webhook từ ngân hàng gửi xác nhận thanh toán thành công tức thì mà không cần chuyển tiền thật.
            </p>
            <button
              onClick={handleSimulateWebhook}
              disabled={isSimulating}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSimulating ? 'Đang gửi Webhook xác nhận...' : 'Mô Phỏng Xác Nhận Thanh Toán Thành Công (Sandbox)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
