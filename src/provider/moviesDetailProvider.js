"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import { UseGetNowPlaying } from "@/hookAPI/TMDB/movieList/UseGetNowPlaying";
import { UseGetPopular } from "@/hookAPI/TMDB/movieList/UseGetPopular";
import { UseGetTopRated } from "@/hookAPI/TMDB/movieList/UseGetTopRated";
import { UseGetUpcoming } from "@/hookAPI/TMDB/movieList/UseGetUpcoming";
import { useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";

const MoviesDetailContext = createContext();

export const MoviesProviderDetail = ({ children }) => {
  const route = useRouter();

  const handleViewAllClick = (category) => {
    route.push(`/movies/${category}`);
  };

  return (
    <MoviesDetailContext.Provider
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
    </MoviesDetailContext.Provider>
  );
};

export const useMoviesDetail = () => useContext(MoviesDetailContext);