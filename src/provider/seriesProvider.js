"use client";

import { UseGetAiringTodaySeries } from "@/hookAPI/TMDB/seriesList/UseGetAiringTodaySeries";
import { UseGetOnTheAirSeries } from "@/hookAPI/TMDB/seriesList/UseGetOnTheAirSeries";
import { UseGetPopularSeries } from "@/hookAPI/TMDB/seriesList/UseGetPopularSeries";
import { UseGetTopRatedSeries } from "@/hookAPI/TMDB/seriesList/UseTopRatedSeries";
import { useParams, useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";

const SeriesContext = createContext();

export const SeriesProvider = ({ children }) => {
  const route = useRouter();
  const { seriesCategory } = useParams();

  const { data: airingTodaySeriesData, isLoading: isAiringTodayLoading } =
    UseGetAiringTodaySeries(!seriesCategory || seriesCategory === "airing-today");

  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    UseGetOnTheAirSeries(!seriesCategory || seriesCategory === "on-the-air");

  const { data: popularData, isLoading: isPopularLoading } =
    UseGetPopularSeries(!seriesCategory || seriesCategory === "popular");

  const { data: topRatedData, isLoading: isTopRatedLoading } =
    UseGetTopRatedSeries(!seriesCategory || seriesCategory === "top-rated");

  const handleViewAllClick = (category) => {
    route.push(`/series/${category}`);
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

        handleViewAllClick,
      }}
    >
      {children}
    </SeriesContext.Provider>
  );
};

export const useSeries = () => useContext(SeriesContext);
