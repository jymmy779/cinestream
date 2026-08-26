"use client";

import MovieCatalogClient from "@/app/components/Movies/MovieCatalog/MovieCatalogClient";
import { CatalogInitialData } from "@/app/utils/serverFetch";
import { INTERNAL_API_URL } from "@/app/utils/apiConfig";

export default function Phim4KClient({ initialData }: { initialData?: CatalogInitialData }) {
    return (
        <MovieCatalogClient
            title="Tuyển Tập Phim 4K"
            baseApiUrl={`${INTERNAL_API_URL}/danh-sach/phim-4k`}
            itemsPerPage={32}
            hideSidebar={true}
            initialData={initialData}
        />
    );
}
