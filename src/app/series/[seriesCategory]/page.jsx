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
    currentPage,
    handlePageChange,
  } = useSeries();

  const categoryMap = {
    "airing-today": airingTodaySeriesData?.results,
    "on-the-air": onTheAirData?.results,
    popular: popularData?.results,
    "top-rated": topRatedData?.results,
  };

  const loadingMap = {
    "airing-today": isAiringTodayLoading,
    "on-the-air": isOnTheAirLoading,
    popular: isPopularLoading,
    "top-rated": isTopRatedLoading,
  };

  const totalPagesMap = {
    "airing-today": airingTodaySeriesData?.total_pages,
    "on-the-air": onTheAirData?.total_pages,
    popular: popularData?.total_pages,
    "top-rated": topRatedData?.total_pages,
  };

  const selectedData = categoryMap[seriesCategory];
  const isLoading = loadingMap[seriesCategory];
  // TMDB API has a maximum limit of 500 pages
  const totalPages = Math.min(totalPagesMap[seriesCategory] || 1, 500);

  return (
    <FilmLayoutFull
      data={selectedData}
      isLoading={isLoading}
      type="series"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
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
