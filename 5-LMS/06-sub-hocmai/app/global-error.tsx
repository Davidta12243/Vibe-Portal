"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 font-sans p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center space-y-4 border border-gray-200">
          <h2 className="text-xl font-bold text-red-600">Lỗi tải ứng dụng</h2>
          <p className="text-sm text-gray-600">
            {error?.message || "Đã xảy ra lỗi khi khởi chạy ứng dụng (client-side exception)."}
          </p>
          <div className="text-xs bg-gray-100 p-3 rounded text-left overflow-auto text-gray-700 max-h-36">
            Gợi ý: Kiểm tra biến môi trường NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY trên Vercel hoặc xem log trong Browser Console (F12).
          </div>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
