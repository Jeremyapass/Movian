"use client";
import FilmLayoutFull from "@/components/Organism/layouts/FilmLayoutFull";
import { useMovies } from "@/provider/moviesProvider";
import { useParams } from "next/navigation";
import React from "react";

const MovieCategoryPage = () => {
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
    "now-playing": nowPlayingData,
    popular: popularData,
    upcoming: upcomingData,
    "top-rated": topRatedData,
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
    <FilmLayoutFull data={selectedData} isLoading={isLoading} type="movies" />
  );
};

export default MovieCategoryPage;
