"use client";

import { UseGetAiringTodaySeries } from "@/hookAPI/TMDB/seriesList/UseGetAiringTodaySeries";
import { UseGetOnTheAirSeries } from "@/hookAPI/TMDB/seriesList/UseGetOnTheAirSeries";
import { UseGetPopularSeries } from "@/hookAPI/TMDB/seriesList/UseGetPopularSeries";
import { UseGetTopRatedSeries } from "@/hookAPI/TMDB/seriesList/UseTopRatedSeries";
import { useParams, useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

const SeriesContext = createContext();

export const SeriesProvider = ({ children }) => {
  const route = useRouter();
  const { seriesCategory } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: airingTodaySeriesData, isLoading: isAiringTodayLoading } =
    UseGetAiringTodaySeries(
      !seriesCategory || seriesCategory === "airing-today",
      currentPage
    );

  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    UseGetOnTheAirSeries(
      !seriesCategory || seriesCategory === "on-the-air",
      currentPage
    );

  const { data: popularData, isLoading: isPopularLoading } =
    UseGetPopularSeries(
      !seriesCategory || seriesCategory === "popular",
      currentPage
    );

  const { data: topRatedData, isLoading: isTopRatedLoading } =
    UseGetTopRatedSeries(
      !seriesCategory || seriesCategory === "top-rated",
      currentPage
    );

  const handleViewAllClick = (category) => {
    route.push(`/series/${category}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SeriesContext.Provider
      value={{
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
        handleViewAllClick,
      }}
    >
      {children}
    </SeriesContext.Provider>
  );
};

export const useSeries = () => useContext(SeriesContext);
