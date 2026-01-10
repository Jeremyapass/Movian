"use client";
import { UseGetGenreIdMovie } from "@/hookAPI/TMDB/genre/UseGetGenreIdMovie";
import { UseGetGenreIdSeries } from "@/hookAPI/TMDB/genre/UseGetGenreIdSeries";
import React, { createContext, useContext, useState } from "react";

const GenreDetailContext = createContext();

export const GenreDetailProvider = ({ children, genreId, type }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: movieData, isLoading: isMovieLoading } = UseGetGenreIdMovie(
    genreId,
    currentPage,
    type === "movie"
  );

  const { data: seriesData, isLoading: isSeriesLoading } = UseGetGenreIdSeries(
    genreId,
    currentPage,
    type === "series"
  );

  const data = type === "movie" ? movieData : seriesData;
  const isLoading = type === "movie" ? isMovieLoading : isSeriesLoading;

  // TMDB API has a maximum limit of 500 pages
  const totalPages = Math.min(data?.total_pages || 1, 500);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <GenreDetailContext.Provider
      value={{
        data: data?.results || [],
        isLoading,
        currentPage,
        totalPages,
        handlePageChange,
      }}
    >
      {children}
    </GenreDetailContext.Provider>
  );
};

export const useGenreDetail = () => {
  const context = useContext(GenreDetailContext);
  if (!context) {
    throw new Error("useGenreDetail must be used inside GenreDetailProvider");
  }
  return context;
};
