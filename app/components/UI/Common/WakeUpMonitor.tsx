"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const REFRESH_THRESHOLD = 5 * 60 * 1000;

/**
 * WakeUpMonitor: Theo dõi khi người dùng quay lại tab sau một thời gian dài.
 * Nếu vắng mặt > 15 phút, tự động làm mới dữ liệu để tránh trang bị trống hoặc treo.
 */
export default function WakeUpMonitor() {
  const router = useRouter();
  const pathname = usePathname();
  const isMovieRoute = pathname.startsWith("/phim/");
  const lastActiveRef = useRef<number>(0);

  useEffect(() => {
    lastActiveRef.current = Date.now();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        const timeSinceLastActive = now - lastActiveRef.current;

        // Nếu người dùng quay lại sau hơn 15 phút
        if (timeSinceLastActive > REFRESH_THRESHOLD && !isMovieRoute) {
          // Sử dụng router.refresh() để Next.js lấy lại dữ liệu Server Components 
          // mà không làm trắng trang (flicker)
          router.refresh();
          
          // Cập nhật lại thời gian active
          lastActiveRef.current = now;
        }
      } else {
        // Khi người dùng thoát tab/ẩn trình duyệt, ghi lại thời điểm cuối cùng
        lastActiveRef.current = Date.now();
      }
    };

    // Lắng nghe sự kiện thay đổi trạng thái hiển thị của trang
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, isMovieRoute]);

  // Component này không render gì ra UI
  return null;
}
