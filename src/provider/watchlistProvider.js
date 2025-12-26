"use client";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import { useGetWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetWatchlistFilm";
import { useGetMoviesDetails } from "@/hookAPI/TMDB/movies/UseGetMovieDetails";
import { useGetSeriesDetails } from "@/hookAPI/TMDB/series/UseGetSeriesDetails";
import React, { createContext, useContext, useMemo, useState } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ watchlistId, children }) => {
  const [filterType, setFilterType] = useState("all"); // all | movie | series

  const { data: watchlistData = [], isLoading: isWatchlistLoading } =
    useGetWatchlist();
  const { data: watchlistFilmData = [], isLoading: isWatchlistFilmLoading } =
    useGetWatchlistFilm(watchlistId);

  const movieIds = useMemo(
    () =>
      watchlistFilmData
        .filter((f) => f.type === "movie")
        .map((f) => f.tmdb_movie_id),
    [watchlistFilmData]
  );

  const seriesIds = useMemo(
    () =>
      watchlistFilmData
        .filter((f) => f.type === "series")
        .map((f) => f.tmdb_movie_id),
    [watchlistFilmData]
  );

  const { data: movieDetailsRaw = [], isLoading: isMovieLoading } =
    useGetMoviesDetails(movieIds, {
      enabled:
        movieIds.length > 0 && (filterType === "movie" || filterType === "all"),
    });

  const { data: seriesDetailsRaw = [], isLoading: isSeriesLoading } =
    useGetSeriesDetails(seriesIds, {
      enabled:
        seriesIds.length > 0 &&
        (filterType === "series" || filterType === "all"),
    });

  const movieDetails = useMemo(
    () =>
      movieDetailsRaw.map((item) => ({
        ...item,
        media_type: "movie",
        type: "movie",
      })),
    [movieDetailsRaw]
  );

  const seriesDetails = useMemo(
    () =>
      seriesDetailsRaw.map((item) => ({
        ...item,
        media_type: "tv",
        type: "series",
      })),
    [seriesDetailsRaw]
  );

  const data = useMemo(() => {
    if (filterType === "movie") return movieDetails;
    if (filterType === "series") return seriesDetails;
    return [...movieDetails, ...seriesDetails];
  }, [filterType, movieDetails, seriesDetails]);

  const isWatchlistPageLoading =
    isWatchlistLoading || isMovieLoading || isSeriesLoading;

  const handleFilter = (type) => setFilterType(type);

  return (
    <WatchlistContext.Provider
      value={{
        watchlistData,
        data,
        filterType,

        isWatchlistPageLoading,
        isWatchlistFilmLoading,
        isWatchlistLoading,

        handleFilter,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
