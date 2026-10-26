"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 min-h-[60vh] p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600">Đã xảy ra lỗi!</h2>
      <p className="text-gray-600 text-sm max-w-md">
        {error?.message || "Một lỗi client-side đã xảy ra. Vui lòng kiểm tra Console (F12) hoặc cấu hình biến môi trường."}
      </p>
      <Button onClick={() => reset()} variant="outline">
        Thử lại
      </Button>
    </div>
  );
}
