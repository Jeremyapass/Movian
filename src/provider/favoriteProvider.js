"use client";

import { useGetAllFavoriteFilms } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetAllFavoriteFilms";
import { useGetAllFavoriteMovies } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetAllFavoriteMovies";
import { useGetAllFavoriteSeries } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetAllFavoriteSeries";
import { useGetTotalFilmsFavorite } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetTotalFilmsFavorite";
import React, { createContext, useContext, useMemo, useState } from "react";

const FavoriteContext = createContext(null);

export const FavoriteProvider = ({ children }) => {
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);

  const {
    data: getAllFavoriteFilmsData,
    isLoading: isGetAllFavoriteFilmsLoading,
  } = useGetAllFavoriteFilms({ page, enabled: filterType === "all" });

  const {
    data: getAllFavoriteMoviesData,
    isLoading: isGetAllFavoriteMoviesLoading,
  } = useGetAllFavoriteMovies({ page, enabled: filterType === "movie" });

  const {
    data: getAllFavoriteSeriesData,
    isLoading: isGetAllFavoriteSeriesLoading,
  } = useGetAllFavoriteSeries({ page, enabled: filterType === "series" });

  const { data: getTotalFavoriteData, isLoading: isTotalFavoriteLoading } =
    useGetTotalFilmsFavorite();

  const isLoading =
    isGetAllFavoriteFilmsLoading ||
    isGetAllFavoriteMoviesLoading ||
    isGetAllFavoriteSeriesLoading ||
    isTotalFavoriteLoading;

  const dataFilms = useMemo(() => {
    if (filterType === "movie")
      return (
        getAllFavoriteMoviesData || { data: [], totalPages: 1, totalItems: 0 }
      );
    if (filterType === "series")
      return (
        getAllFavoriteSeriesData || { data: [], totalPages: 1, totalItems: 0 }
      );
    return (
      getAllFavoriteFilmsData || { data: [], totalPages: 1, totalItems: 0 }
    );
  }, [
    filterType,
    getAllFavoriteFilmsData,
    getAllFavoriteMoviesData,
    getAllFavoriteSeriesData,
  ]);

  const handleFilter = (type) => {
    setFilterType(type);
    setPage(1); // reset pagination
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FavoriteContext.Provider
      value={{
        filterType,
        setPage,
        page,

        dataFilms,
        getTotalFavoriteData,

        isLoading,

        handleFilter,
        handlePageChange,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used inside FavoriteProvider");
  }
  return context;
};
