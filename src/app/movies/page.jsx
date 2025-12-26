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
        title={"NOW PLAYING TUNGGU RIZQI"}
        subtitle={"Film yang lagi nge-hype, jangan sampai ketinggalan!"}
        data={nowPlayingData?.results}
        isLoading={isNowPlayingLoading}
        onViewAllClick={() => handleViewAllClick("now-playing")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Lagi ramai dibicarakan"}
        subtitle={"Film yang lagi nge-hype, jangan sampai ketinggalan!"}
        data={popularData?.results}
        isLoading={isPopularLoading}
        onViewAllClick={() => handleViewAllClick("popular")}
      />
      <CarouselLayout
        type={"movie"}
        title={"UPCOMING TUNGGU RIZQI"}
        subtitle={"TUNGGU RIZQI"}
        data={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAllClick={() => handleViewAllClick("upcoming")}
      />
      <CarouselLayout
        type={"movie"}
        title={"TOP RATE TUNGGU RIZQI"}
        subtitle={"TUNGGU RIZQI"}
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
