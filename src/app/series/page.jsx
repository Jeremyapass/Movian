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
        title={"Serial Populer"}
        subtitle={"Pilihan serial yang paling banyak ditonton dan disukai."}
        data={popularData?.results}
        onViewAllClick={() => handleViewAllClick("popular")}
        isLoading={isPopularLoading}
      />
      <CarouselLayout
        type={"series"}
        title={"Serial Tayang Hari Ini"}
        subtitle={"Episode terbaru yang tayang hari ini."}
        data={airingTodaySeriesData?.results}
        onViewAllClick={() => handleViewAllClick("airing-today")}
        isLoading={isAiringTodayLoading}
      />
      <CarouselLayout
        type={"series"}
        title={"Serial Sedang Tayang  "}
        subtitle={"Serial yang sedang tayang saat ini."}
        data={onTheAirData?.results}
        isLoading={isOnTheAirLoading}
        onViewAllClick={() => handleViewAllClick("on-the-air")}
      />
      <CarouselLayout
        type={"series"}
        title={"Disukai Penonton"}
        subtitle={"Serial yang paling disukai penonton."}
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
