"use client";
import { UseGetMovieListGenre } from "@/hookAPI/TMDB/genre/UseGetMovieListGenre";
import { UseGetSeriesListGenre } from "@/hookAPI/TMDB/genre/UseGetSeriesListGenre";
import React, { createContext, useContext, useMemo, useState } from "react";

const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [filterType, setFilterType] = useState("movie");

  const { data: movieListGenreData, isLoading: isMovieListGenreLoading } =
    UseGetMovieListGenre();
  const { data: seriesListGenreData, isLoading: isSeriesListGenreLoading } =
    UseGetSeriesListGenre();

  const isLoading = isMovieListGenreLoading || isSeriesListGenreLoading;

  const genreData = useMemo(() => {
    if (filterType === "series") {
      return seriesListGenreData || { genres: [] };
    }
    return movieListGenreData || { genres: [] };
  }, [filterType, movieListGenreData, seriesListGenreData]);

  const handleFilter = (type) => {
    setFilterType(type);
  };

  return (
    <GenreContext.Provider
      value={{
        movieListGenreData,
        isMovieListGenreLoading,
        seriesListGenreData,
        isSeriesListGenreLoading,
        filterType,
        genreData,
        isLoading,
        handleFilter,
      }}
    >
      {children}
    </GenreContext.Provider>
  );
};

export const useGenre = () => useContext(GenreContext);
