import { Metadata } from "next";
import { Suspense } from "react";
import CatalogSkeleton from "@/app/components/Movies/MovieCatalog/CatalogSkeleton";
import { fetchCatalogData } from "@/app/utils/serverFetch";
import { getAbsoluteUrl } from "@/app/config/site";
import { INTERNAL_API_URL } from "@/app/utils/apiConfig";
import Phim4KClient from "./Phim4KClient";

export const revalidate = 300; // Đồng bộ 300 giây (5 phút) toàn hệ thống

export const metadata: Metadata = {
    title: "Phim 4K Siêu Nét | CineStream - Trải Nghiệm Điện Ảnh Đỉnh Cao",
    description: "Tuyển tập những bộ phim có chất lượng 4K siêu nét trên CineStream. Xem phim 4K không quảng cáo, hình ảnh chân thực, âm thanh sống động.",
    keywords: [
        "phim 4k", "phim 4k vietsub", "xem phim 4k", "phim sieu net",
        "phim 4k mien phi", "cinestream 4k"
    ],
    alternates: {
        canonical: getAbsoluteUrl('/phim-4k'),
    },
};

export default function Phim4KPage() {
    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <Phim4KData />
        </Suspense>
    );
}

async function Phim4KData() {
    const initialData = await fetchCatalogData(
        `${INTERNAL_API_URL}/danh-sach/phim-4k`,
        1,
        32
    );

    return <Phim4KClient initialData={initialData} />;
}
