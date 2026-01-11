"use client";
import { useGetPublicWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useGetPublicWatchlistFilm";
import React, { createContext, useContext, useMemo, useState } from "react";

const PublicWatchlistFilmContext = createContext();

export const PublicWatchlistFilmProvider = ({ publicId, children }) => {
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);

  const {
    data: publicWatchlistData,
    isLoading,
    error,
  } = useGetPublicWatchlistFilm({
    publicId,
    page,
  });

  // Check if error is because watchlist is private
  const isPrivateWatchlist = error?.message?.includes(
    "tidak ditemukan atau tidak publik"
  );

  // Extract watchlist info from query response
  const getWatchlistData = useMemo(() => {
    if (isPrivateWatchlist) {
      // Return fake data for private watchlist to trigger UI
      return { data: { name: "", is_public: false } };
    }
    if (!publicWatchlistData?.watchlistInfo) {
      return { data: null };
    }
    return { data: publicWatchlistData.watchlistInfo };
  }, [publicWatchlistData, isPrivateWatchlist]);

  // Filter films by type
  const dataFilms = useMemo(() => {
    if (isPrivateWatchlist) {
      // Return empty for private watchlist
      return { data: [], totalPages: 1, totalItems: 0 };
    }
    if (!publicWatchlistData?.data) {
      return { data: [], totalPages: 1, totalItems: 0 };
    }

    let filteredData = publicWatchlistData.data;

    if (filterType === "movie") {
      filteredData = publicWatchlistData.data.filter(
        (item) => item.movie_cache.type === "movie"
      );
    } else if (filterType === "series") {
      filteredData = publicWatchlistData.data.filter(
        (item) => item.movie_cache.type === "series"
      );
    }

    return {
      data: filteredData,
      totalPages: publicWatchlistData.totalPages,
      totalItems: publicWatchlistData.totalItems,
    };
  }, [publicWatchlistData, filterType, isPrivateWatchlist]);

  const handleFilter = (type) => {
    setFilterType(type);
    setPage(1); // reset pagination
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PublicWatchlistFilmContext.Provider
      value={{
        getWatchlistData,
        filterType,
        setPage,
        page,
        dataFilms,
        isLoading,
        error,
        handleFilter,
        handlePageChange,
        isPublicView: true,
      }}
    >
      {children}
    </PublicWatchlistFilmContext.Provider>
  );
};

export const usePublicWatchlistFilm = () =>
  useContext(PublicWatchlistFilmContext);
