"use client";
import Banner from "@/components/Atoms/Banner";
import CarouselLayout from "@/components/Molecules/carouselLayout/CarouselLayout";
import { SeriesProvider, useSeries } from "@/provider/seriesProvider";
import React from "react";

const PageContent = () => {
  const {
    popularData,
    airingTodaySeriesData,
    onTheAirData,
    topRatedData,
    handleViewAllClick,
    isAiringTodayLoading,
    isOnTheAirLoading,
    isPopularLoading,
    isTopRatedLoading,
  } = useSeries();

  return (
    <div
      className={`flex flex-col gap-12 justify-center h-full items-center  w-full`}
    >
      <Banner data={popularData?.results} />
      <CarouselLayout
        type={"series"}
        title={"POPULAR TUNGGU RIZQI"}
        subtitle={"Film yang lagi nge-hype, jangan sampai ketinggalan!"}
        data={popularData?.results}
        onViewAllClick={() => handleViewAllClick("popular")}
        isLoading={isPopularLoading}
      />
      <CarouselLayout
        type={"series"}
        title={"AIRING TODAY TUNGGU RIZQI"}
        subtitle={"Film yang lagi nge-hype, jangan sampai ketinggalan!"}
        data={airingTodaySeriesData?.results}
        onViewAllClick={() => handleViewAllClick("airing-today")}
        isLoading={isAiringTodayLoading}
      />
      <CarouselLayout
        type={"series"}
        title={"ON THE AIR TUNGGU RIZQI"}
        subtitle={"TUNGGU RIZQI"}
        data={onTheAirData?.results}
        isLoading={isOnTheAirLoading}
        onViewAllClick={() => handleViewAllClick("on-the-air")}
      />
      <CarouselLayout
        type={"series"}
        title={"TOP RATED SERIES TUNGGU RIZQI"}
        subtitle={"TUNGGU RIZQI"}
        data={topRatedData?.results}
        isLoading={isTopRatedLoading}
        onViewAllClick={() => handleViewAllClick("top-rated")}
      />
    </div>
  );
};
const SeriesPage = () => {
  return (
    <SeriesProvider>
      <PageContent />
    </SeriesProvider>
  );
};
export default SeriesPage;
