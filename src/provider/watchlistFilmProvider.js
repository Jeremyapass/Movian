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
    useGetWatchlist({watchlistId : [watchlistId]});  
  const {
    data: getAllWatchlistFilmData,
    isLoading: isAllWatchlistFilmLoading,
  } = useGetAllWatchlistFilm({
    watchlistId: [watchlistId],
    page,
  });
  const {
    data: getAllWatchlistMovieData,
    isLoading: isAllWatchlistMovieLoading,
  } = useGetAllWatchlistMovie({
    watchlistId: watchlistId,
    enabled: filterType === "movie",
  });
  const {
    data: getAllWatchlistSeriesData,
    isLoading: isAllWatchlistSeriesLoading,
  } = useGetAllWatchlistSeries({
    watchlistId: watchlistId,
    enabled: filterType === "series",
  });

  const isLoading =
    isAllWatchlistFilmLoading ||
    isAllWatchlistMovieLoading ||
    isAllWatchlistSeriesLoading;

  const dataFilms = useMemo(() => {
    if (filterType === "movie") return getAllWatchlistMovieData;
    if (filterType === "series") return getAllWatchlistSeriesData;
    return getAllWatchlistFilmData;
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
      }}
    >
      {children}
    </WatchlistFilmContext.Provider>
  );
};

export const useWatchlistFilm = () => useContext(WatchlistFilmContext);
