import Link from 'next/link';
import { ShieldCheck, Lock, Award, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-4 h-4 text-blue-300" />
              </div>
              <span className="font-semibold text-slate-900 text-sm">VERITAS ACADEMIA</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Nền tảng học thuật riêng tư dành riêng cho các chuyên gia và học viên chọn lọc. Hệ thống bảo mật cao cấp với định danh và phân quyền chuẩn mực.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">Điều Hướng Học Tập</h4>
            <ul className="space-y-1.5">
              <li><Link href="/courses" className="hover:text-blue-700">Thư Viện Bài Giảng Chuyên Sâu</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-700">Chính Sách & Gói Hội Viên</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-700">Không Gian Học Tập Cá Nhân</Link></li>
              <li><Link href="/register" className="hover:text-blue-700">Kích Hoạt Lời Mời Nhập Học</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">Cam Kết Chất Lượng</h4>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Nội dung độc quyền, bảo mật</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Hai video demo miễn phí cho mỗi bài</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Thanh toán tự động VietQR an toàn</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">Chế Độ Private</h4>
            <p className="text-slate-500 leading-relaxed">
              Hệ thống chỉ mở đăng ký cho các học viên sở hữu mã mời hợp lệ do Ban Quản Trị hoặc Giảng viên cấp.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-medium text-slate-700">Hỗ trợ học viên:</p>
              <p className="text-[11px] text-blue-700 font-semibold">support@lms.edu.vn</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Veritas Private LMS. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Tiêu chuẩn bảo mật ISO/IEC 27001</span>
            <span>·</span>
            <span>Academic Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
