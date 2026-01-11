"use client";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import { useGetAllWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useGetAllWatchlistFilms";
import { useGetAllWatchlistMovie } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useGetAllWatchlistMovies";
import { useGetAllWatchlistSeries } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useGetAllWatchlistSeries";
import React, { createContext, useContext, useMemo, useState } from "react";

const WatchlistFilmContext = createContext();

export const WatchlistFilmProvider = ({ watchlistId, children }) => {
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);

  const { data: getWatchlistData, isLoading: isWatchlistLoading } =
    useGetWatchlist({ watchlistId: [watchlistId] });
  const {
    data: getAllWatchlistFilmData,
    isLoading: isAllWatchlistFilmLoading,
  } = useGetAllWatchlistFilm({
    watchlistId: [watchlistId],
    page,
    enabled: filterType === "all",
  });
  const {
    data: getAllWatchlistMovieData,
    isLoading: isAllWatchlistMovieLoading,
  } = useGetAllWatchlistMovie({
    watchlistId: watchlistId,
    page,
    enabled: filterType === "movie",
  });
  const {
    data: getAllWatchlistSeriesData,
    isLoading: isAllWatchlistSeriesLoading,
  } = useGetAllWatchlistSeries({
    watchlistId: watchlistId,
    page,
    enabled: filterType === "series",
  });

  const isLoading =
    isAllWatchlistFilmLoading ||
    isAllWatchlistMovieLoading ||
    isAllWatchlistSeriesLoading;

  const dataFilms = useMemo(() => {
    if (filterType === "movie")
      return (
        getAllWatchlistMovieData || { data: [], totalPages: 1, totalItems: 0 }
      );
    if (filterType === "series")
      return (
        getAllWatchlistSeriesData || { data: [], totalPages: 1, totalItems: 0 }
      );
    return (
      getAllWatchlistFilmData || { data: [], totalPages: 1, totalItems: 0 }
    );
  }, [
    filterType,
    getAllWatchlistFilmData,
    getAllWatchlistMovieData,
    getAllWatchlistSeriesData,
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
    <WatchlistFilmContext.Provider
      value={{
        getWatchlistData,

        filterType,
        setPage,
        page,

        dataFilms,
        isLoading,

        handleFilter,
        handlePageChange,
        isPublicView: false,
      }}
    >
      {children}
    </WatchlistFilmContext.Provider>
  );
};

export const useWatchlistFilm = () => useContext(WatchlistFilmContext);
