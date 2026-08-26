import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAbsoluteUrl } from "@/app/config/site";
import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { fetchWithRedis } from "@/app/lib/fetch-with-redis";
import CatalogSkeleton from "@/app/components/Movies/MovieCatalog/CatalogSkeleton";
import { fetchCatalogData } from "@/app/utils/serverFetch";
import { INTERNAL_API_URL } from "@/app/utils/apiConfig";

export const revalidate = 300; // Đồng bộ 300 giây (5 phút) toàn hệ thống

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    let title = slug.split("-").join(" ");
    title = title.charAt(0).toUpperCase() + title.slice(1);

    try {
        const res = await fetchWithRedis(`${INTERNAL_API_URL}/the-loai`, { revalidate: 60 });
        const categories = (res as any)?.data?.items || (Array.isArray(res) ? res : []);
        const category = categories.find((cat: any) => cat.slug === slug);
        if (category) title = category.name;
    } catch (err) {
        console.error("Lỗi fetch metadata thể loại:", err);
    }

    return {
        title: `Phim ${title} | CineStream - Xem phim online chất lượng cao`,
        description: `Danh sách phim thuộc thể loại ${title} mới nhất, cập nhật liên tục mỗi ngày trên CineStream. Xem phim ${title} vietsub, thuyet minh 4K.`,
        keywords: [
            `phim ${title}`,
            `xem phim ${title}`,
            `phim ${title} moi`,
            `phim ${title} hay`,
            `phim ${title} vietsub`,
            `phim ${title} thuyet minh`,
            "cinestream",
            "xem phim online"
        ],
        alternates: {
            canonical: getAbsoluteUrl(`/the-loai/${slug}`),
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    
    return (
        <Suspense fallback={<CatalogSkeleton />}>
            <CategoryData slug={slug} />
        </Suspense>
    );
}

async function CategoryData({ slug }: { slug: string }) {
    let categoryName = slug.split("-").join(" ");
    categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    try {
        const res = await fetchWithRedis(`${INTERNAL_API_URL}/the-loai`, { revalidate: 300 });
        const categories = (res as any)?.data?.items || (Array.isArray(res) ? res : []);
        const category = categories.find((cat: any) => cat.slug === slug);
        if (category) categoryName = category.name;
    } catch (err) {
        console.error("Lỗi fetch tên thể loại:", err);
    }

    const initialData = await fetchCatalogData(
        `${INTERNAL_API_URL}/the-loai/${slug}`,
        1,
        48
    );

    return (
        <CategoryClient slug={slug} title={`Danh sách phim ${categoryName}`} initialData={initialData} />
    );
}
