"use client";
import FilmLayoutFull from "@/components/Organism/layouts/FilmLayoutFull";
import { SeriesProvider, useSeries } from "@/provider/seriesProvider";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const { seriesCategory } = useParams();
  const {
    airingTodaySeriesData,
    onTheAirData,
    popularData,
    topRatedData,
    isAiringTodayLoading,
    isOnTheAirLoading,
    isPopularLoading,
    isTopRatedLoading,
  } = useSeries();

  const categoryMap = {
    "airing-today": airingTodaySeriesData?.results,
    "on-the-air": onTheAirData?.results,
    "popular": popularData?.results,
    "top-rated": topRatedData?.results,
  };  

  const loadingMap = {
    "airing-today": isAiringTodayLoading,
    "on-the-air": isOnTheAirLoading,
    "popular": isPopularLoading,
    "top-rated": isTopRatedLoading,
  };

  const selectedData = categoryMap[seriesCategory];
  const isLoading = loadingMap[seriesCategory];

  return (
    <FilmLayoutFull data={selectedData} isLoading={isLoading} type="series" />
  );
};

const SeriesCategoryPage = () => {
  return (
    <SeriesProvider>
      <PageContent />
    </SeriesProvider>
  );
};

export default SeriesCategoryPage;
