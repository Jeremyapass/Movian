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
    currentPage,
    handlePageChange,
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

  const totalPagesMap = {
    "now-playing": nowPlayingData?.total_pages,
    popular: popularData?.total_pages,
    upcoming: upcomingData?.total_pages,
    "top-rated": topRatedData?.total_pages,
  };

  const selectedData = categoryMap[movieCategory];
  const isLoading = loadingMap[movieCategory];
  // TMDB API has a maximum limit of 500 pages
  const totalPages = Math.min(totalPagesMap[movieCategory] || 1, 500);

  return (
    <FilmLayoutFull
      data={selectedData}
      isLoading={isLoading}
      type="movie"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
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
