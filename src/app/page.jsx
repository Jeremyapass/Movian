"use client";

import React from "react";
import Banner from "@/components/Atoms/Banner";
import { MainProvider, useMain } from "@/provider/mainProvider";
import CarouselLayout from "@/components/Molecules/carouselLayout/CarouselLayout";

const PageConent = () => {
  const {
    nowPlayingData,
    popularData,
    upcomingData,
    topRatedData,
    airingTodaySeriesData,
    isnowPlayingLoading,
    isPopularLoading,
    isUpcomingLoading,
    isTopRatedLoading,
    isAiringTodaySeriesLoading,
    handleViewAllClickMovies,
    handleViewAllClickSeries,
  } = useMain();

  return (
    <div
      className={`flex flex-col gap-12 justify-center h-full items-center w-full`}
    >
      <Banner data={nowPlayingData?.results} />
      <CarouselLayout
        type={"movie"}
        title={"Film Populer"}
        subtitle={"Pilihan film yang paling banyak ditonton dan disukai."}
        data={popularData?.results}
        isLoading={isPopularLoading}
        onViewAllClick={() => handleViewAllClickMovies("popular")}
      />
      <CarouselLayout
        type={"series"}
        title={"Serial Tayang Hari Ini"}
        subtitle={"Episode terbaru yang tayang hari ini."}
        data={airingTodaySeriesData?.results}
        isLoading={isAiringTodaySeriesLoading}
        onViewAllClick={() => handleViewAllClickSeries("airing-today")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Rilis Terbaru"}
        subtitle={"Film yang baru dirilis."}
        data={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAllClick={() => handleViewAllClickMovies("upcoming")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Disukai Penonton"}
        subtitle={"Film yang paling disukai penonton."}
        data={topRatedData?.results}
        isLoading={isTopRatedLoading}
        onViewAllClick={() => handleViewAllClickMovies("top-rated")}
      />
    </div>
  );
};

export default function Home() {
  return (
    <MainProvider>
      <PageConent />
    </MainProvider>
  );
}
