import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VERITAS ACADEMIA | Private Online Learning Platform (LMS)',
  description: 'Nền tảng học trực tuyến riêng tư chuẩn mực học thuật, tích hợp bài giảng chuyên sâu, video demo kép và hệ thống thanh toán VietQR tự động.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
