"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import { UseGetNowPlaying } from "@/hookAPI/TMDB/movieList/UseGetNowPlaying";
import { UseGetPopular } from "@/hookAPI/TMDB/movieList/UseGetPopular";
import { UseGetTopRated } from "@/hookAPI/TMDB/movieList/UseGetTopRated";
import { UseGetUpcoming } from "@/hookAPI/TMDB/movieList/UseGetUpcoming";
import { useParams, useRouter } from "next/navigation";
import React, { createContext, useContext } from "react";

const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
  const route = useRouter();
  const { movieCategory } = useParams();
  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    UseGetNowPlaying(!movieCategory || movieCategory === "now-playing");
  const { data: popularData, isLoading: isPopularLoading } = UseGetPopular(
    !movieCategory || movieCategory === "popular"
  );
  const { data: upcomingData, isLoading: isUpcomingLoading } = UseGetUpcoming(
    !movieCategory || movieCategory === "upcoming"
  );
  const { data: topRatedData, isLoading: isTopRatedLoading } = UseGetTopRated(
    !movieCategory || movieCategory === "top-rated"
  );

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
