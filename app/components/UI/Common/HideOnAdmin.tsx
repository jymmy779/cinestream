"use client";
import { usePathname } from "next/navigation";

export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    
    // Nếu đang ở trang admin hoặc trang bảo trì, không render các component con (Header, Footer, Sidebar, Popup...)
    if (pathname.startsWith("/admin") || pathname.startsWith("/maintenance")) {
        return null;
    }
    
    return <>{children}</>;
}
