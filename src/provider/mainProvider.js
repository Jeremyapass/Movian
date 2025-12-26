"use client";
import { UseGetNowPlaying } from "@/hookAPI/TMDB/movieList/UseGetNowPlaying";
import { UseGetPopular } from "@/hookAPI/TMDB/movieList/UseGetPopular";
import { UseGetTopRated } from "@/hookAPI/TMDB/movieList/UseGetTopRated";
import { UseGetUpcoming } from "@/hookAPI/TMDB/movieList/UseGetUpcoming";
import { UseGetAiringTodaySeries } from "@/hookAPI/TMDB/seriesList/UseGetAiringTodaySeries";
import { useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";

const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const route = useRouter();
  const { data: nowPlayingData, isLoading: isnowPlayingLoading } =
    UseGetNowPlaying();
  const { data: popularData, isLoading: isPopularLoading } = UseGetPopular();
  const { data: upcomingData, isLoading: isUpcomingLoading } = UseGetUpcoming();
  const { data: topRatedData, isLoading: isTopRatedLoading } = UseGetTopRated();
  const { data: airingTodaySeriesData, isLoading: isAiringTodaySeriesLoading } =
    UseGetAiringTodaySeries();

  const handleViewAllClickMovies = (category) => {
    route.push(`/movies/${category}`);
  };
  const handleViewAllClickSeries = (category) => {
    route.push(`/series/${category}`);
  };

  return (
    <MainContext.Provider
      value={{
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
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMain = () => useContext(MainContext);
