"use client";
import { UseGetMovieListGenre } from "@/hookAPI/TMDB/genre/UseGetMovieListGenre";
import React, { createContext, useContext } from "react";

const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const { data: movieListGenreData, isLoading: isMovieListGenreLoading } =
    UseGetMovieListGenre();
  return (
    <GenreContext.Provider
      value={{
        movieListGenreData,
        isMovieListGenreLoading,
      }}
    >
      {children}
    </GenreContext.Provider>
  );
};

export const useGenre = () => useContext(GenreContext);
