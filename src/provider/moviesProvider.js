"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import { UseGetNowPlaying } from "@/hookAPI/TMDB/movieList/UseGetNowPlaying";
import { UseGetPopular } from "@/hookAPI/TMDB/movieList/UseGetPopular";
import { UseGetTopRated } from "@/hookAPI/TMDB/movieList/UseGetTopRated";
import { UseGetUpcoming } from "@/hookAPI/TMDB/movieList/UseGetUpcoming";
import { useParams, useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
  const route = useRouter();
  const { movieCategory } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: nowPlayingData, isLoading: isNowPlayingLoading } =
    UseGetNowPlaying(
      !movieCategory || movieCategory === "now-playing",
      currentPage
    );
  const { data: popularData, isLoading: isPopularLoading } = UseGetPopular(
    !movieCategory || movieCategory === "popular",
    currentPage
  );
  const { data: upcomingData, isLoading: isUpcomingLoading } = UseGetUpcoming(
    !movieCategory || movieCategory === "upcoming",
    currentPage
  );
  const { data: topRatedData, isLoading: isTopRatedLoading } = UseGetTopRated(
    !movieCategory || movieCategory === "top-rated",
    currentPage
  );

  const handleViewAllClick = (category) => {
    route.push(`/movies/${category}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        currentPage,
        handlePageChange,
        handleViewAllClick,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => useContext(MoviesContext);
