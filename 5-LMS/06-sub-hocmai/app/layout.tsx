import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ToasterProvider } from "@/components/providers/toaster-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS Tutorial",
  description: "A course & LMS platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!clerkPubKey) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
            <div className="max-w-md w-full p-6 bg-white border border-amber-300 rounded-xl shadow text-center space-y-3">
              <h2 className="text-xl font-bold text-amber-700">Thiếu cấu hình Clerk Auth</h2>
              <p className="text-sm text-gray-600">
                Biến môi trường <code className="bg-gray-100 px-1 py-0.5 rounded text-red-500 font-mono text-xs">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> chưa được thiết lập trên Vercel.
              </p>
              <p className="text-xs text-gray-500">
                Vui lòng vào <strong>Vercel Settings &gt; Environment Variables</strong> để thêm key từ Clerk Dashboard, sau đó bấm <strong>Redeploy</strong>.
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
