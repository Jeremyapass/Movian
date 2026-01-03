"use client";
import React, { useState } from "react";
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
      className={`flex flex-col gap-12 justify-center h-full items-center  w-full`}
    >
      <Banner data={nowPlayingData?.results} />
      <CarouselLayout
        type={"movie"}
        title={"Lagi ramai dibicarakan"}
        subtitle={"Film yang lagi nge-hype, jangan sampai ketinggalan!"}
        data={popularData?.results}
        isLoading={isPopularLoading}
        onViewAllClick={() => handleViewAllClickMovies("popular")}
      />
      <CarouselLayout
        type={"series"}
        title={"SERIES"}
        subtitle={"Film yang lagi nge-hype, jangan sampai ketinggalan!"}
        data={airingTodaySeriesData?.results}
        isLoading={isAiringTodaySeriesLoading}
        onViewAllClick={() => handleViewAllClickSeries("airing-today")}
      />
      <CarouselLayout
        type={"movie"}
        title={"UPCOMING TUNGGU RIZQI"}
        subtitle={"TUNGGU RIZQI"}
        data={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAllClick={() => handleViewAllClickMovies("upcoming")}
      />
      <CarouselLayout
        type={"movie"}
        title={"TOP RATE TUNGGU RIZQI"}
        subtitle={"TUNGGU RIZQI"}
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
