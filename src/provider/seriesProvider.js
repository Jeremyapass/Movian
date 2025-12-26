"use client";

import { UseGetAiringTodaySeries } from "@/hookAPI/TMDB/seriesList/UseGetAiringTodaySeries";
import { UseGetOnTheAirSeries } from "@/hookAPI/TMDB/seriesList/UseGetOnTheAirSeries";
import { UseGetPopularSeries } from "@/hookAPI/TMDB/seriesList/UseGetPopularSeries";
import { UseGetTopRatedSeries } from "@/hookAPI/TMDB/seriesList/UseTopRatedSeries";
import { useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";

const SeriesContext = createContext();

export const SeriesProvider = ({ children }) => {
  const route = useRouter();
  const { data: airingTodaySeriesData, isLoading: isAiringTodayLoading } =
    UseGetAiringTodaySeries();
  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    UseGetOnTheAirSeries();
  const { data: popularData, isLoading: isPopularLoading } =
    UseGetPopularSeries();
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    UseGetTopRatedSeries();

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
