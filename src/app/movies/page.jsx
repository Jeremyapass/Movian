"use client";
import Banner from "@/components/Atoms/Banner";
import CarouselLayout from "@/components/Molecules/carouselLayout/CarouselLayout";

import { MoviesProvider, useMovies } from "@/provider/moviesProvider";
import React from "react";

const PageContent = () => {
  const {
    nowPlayingData,
    popularData,
    upcomingData,
    topRatedData,
    handleViewAllClick,
    isNowPlayingLoading,
    isPopularLoading,
    isUpcomingLoading,
    isTopRatedLoading,
  } = useMovies();

  return (
    <div
      className={`flex flex-col gap-12 justify-center h-full items-center  w-full`}
    >
      <Banner data={nowPlayingData?.results} />
      <CarouselLayout
        type={"movie"}
        title={"Film Sedang Tayang"}
        subtitle={"Film terbaru yang sedang tayang di bioskop."}
        data={nowPlayingData?.results}
        isLoading={isNowPlayingLoading}
        onViewAllClick={() => handleViewAllClick("now-playing")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Film Populer"}
        subtitle={"Pilihan film yang paling banyak ditonton dan disukai."}
        data={popularData?.results}
        isLoading={isPopularLoading}
        onViewAllClick={() => handleViewAllClick("popular")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Rilis Terbaru"}
        subtitle={"Film yang baru dirilis."}
        data={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAllClick={() => handleViewAllClick("upcoming")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Disukai Penonton"}
        subtitle={"Film yang paling disukai penonton."}
        data={topRatedData?.results}
        isLoading={isTopRatedLoading}
        onViewAllClick={() => handleViewAllClick("top-rated")}
      />
    </div>
  );
};

const MoviesPage = () => {
  return (
    <MoviesProvider>
      <PageContent />
    </MoviesProvider>
  );
};

export default MoviesPage;
