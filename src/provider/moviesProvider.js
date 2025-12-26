"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import { UseGetNowPlaying } from "@/hookAPI/TMDB/movieList/UseGetNowPlaying";
import { UseGetPopular } from "@/hookAPI/TMDB/movieList/UseGetPopular";
import { UseGetTopRated } from "@/hookAPI/TMDB/movieList/UseGetTopRated";
import { UseGetUpcoming } from "@/hookAPI/TMDB/movieList/UseGetUpcoming";
import { useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";

const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
  const route = useRouter();
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    UseGetNowPlaying();
  const { data: popularData, isLoading: isPopularLoading } = UseGetPopular();
  const { data: upcomingData, isLoading: isUpcomingLoading } = UseGetUpcoming();
  const { data: topRatedData, isLoading: isTopRatedLoading } = UseGetTopRated();

  const handleViewAllClick = (category) => {
    route.push(`/movies/${category}`);
  };

  return (
    <MoviesContext.Provider
      value={{
        nowPlayingData,
        popularData,
        upcomingData,
        topRatedData,

        isNowPlayingLoading,
        isPopularLoading,
        isUpcomingLoading,
        isTopRatedLoading,

        handleViewAllClick,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);