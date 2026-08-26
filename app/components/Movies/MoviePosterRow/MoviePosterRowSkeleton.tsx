import React from "react";
import Skeleton from "@/app/components/UI/Skeleton/Skeleton";
import Container from "@/app/components/UI/Container";
import MovieCardSkeleton from "@/app/components/Movies/MovieCard/MovieCardSkeleton";

export default function MoviePosterRowSkeleton() {
    return (
        <Container as="section" className="movie-row-section relative z-30">
            <div className="row-header flex items-center justify-between mb-6">
                <Skeleton className="w-[200px] h-8 lg:h-10" rounded="lg" />
                <Skeleton className="w-20 h-5" rounded="md" />
            </div>

            <div className="row-content">
                <div className="relative overflow-hidden pb-[20px] pt-[5px]">
                    <div className="flex gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[38vw] sm:w-[26vw] md:w-[20vw] lg:w-[15.5vw] xl:w-[13vw]">
                                <MovieCardSkeleton />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}
