"use client";
import FilmDetailLayout from "@/components/Organism/layouts/FilmDetailLayout";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import { useGetAllWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useGetAllWatchlistFilms";
import { useGetSeriesDetails } from "@/hookAPI/TMDB/series/UseGetSeriesDetails";
import { useParams } from "next/navigation";
import React from "react";

const SeriesDetailPage = () => {
  const { seriesId } = useParams();
  const { data: seriesDetailsData, isLoading: isSeriesDetailsLoading } =
    useGetSeriesDetails(seriesId);
  const { data: getAllWatchlistData, isLoading: isWatchlistLoading } =
    useGetWatchlist();
  const watchlistIds = getAllWatchlistData?.data?.map(
    (watchlist) => watchlist.id
  );

  const { data: getAllWatchlistFilmData, isLoading: isWatchlistFilmLoading } =
    useGetAllWatchlistFilm({
      watchlistId: watchlistIds,
      tmdbId: seriesId,
      enabled: !!watchlistIds && watchlistIds.length > 0,
    });

  return (
    <div className=" w-full">
      <FilmDetailLayout
        watchlistData={getAllWatchlistData?.data}
        watchlistFilmData={getAllWatchlistFilmData}
        media_type="series"
        data={seriesDetailsData}
        tmdbMovieId={seriesId}
        isLoadingFilmDetails={isSeriesDetailsLoading}
        isLoadingWatchlist={isWatchlistLoading}
        isLoadingWatchlistFilm={isWatchlistFilmLoading}
      />
    </div>
  );
};

export default SeriesDetailPage;
