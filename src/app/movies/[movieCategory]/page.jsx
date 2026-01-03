"use client";
import FilmLayoutFull from "@/components/Organism/layouts/FilmLayoutFull";
import { MoviesProvider, useMovies } from "@/provider/moviesProvider";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const { movieCategory } = useParams();
  const {
    nowPlayingData,
    popularData,
    upcomingData,
    topRatedData,
    isNowPlayingLoading,
    isPopularLoading,
    isUpcomingLoading,
    isTopRatedLoading,
  } = useMovies();

  const categoryMap = {
    "now-playing": nowPlayingData?.results,
    popular: popularData?.results,
    upcoming: upcomingData?.results,
    "top-rated": topRatedData?.results,
  };

  const loadingMap = {
    "now-playing": isNowPlayingLoading,
    popular: isPopularLoading,
    upcoming: isUpcomingLoading,
    "top-rated": isTopRatedLoading,
  };

  const selectedData = categoryMap[movieCategory];
  const isLoading = loadingMap[movieCategory];

  // console.log('now playing data', nowPlayingData)

  return (
    <FilmLayoutFull data={selectedData} isLoading={isLoading} type="movie" />
  );
};

const MovieCategoryPage = () => {
  return (
    <MoviesProvider>
      <PageContent />
    </MoviesProvider>
  );
};

export default MovieCategoryPage;
