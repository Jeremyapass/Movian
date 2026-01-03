"use client";
import FilmDetailLayout from "@/components/Organism/layouts/FilmDetailLayout";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import { useGetAllWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useGetAllWatchlistFilms";
import { useGetMoviesDetails } from "@/hookAPI/TMDB/movies/UseGetMovieDetails";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const { movieId } = useParams();
  const { data: movieDetailsData, isLoading: isMovieDetailsLoading } =
    useGetMoviesDetails(movieId);
  
  const { data: getAllWatchlistData, isLoading: isWatchlistLoading } =
    useGetWatchlist();
    
  const watchlistIds = getAllWatchlistData?.map((watchlist) => watchlist.id);
  
  const { data: getAllWatchlistFilmData, isLoading: isWatchlistFilmLoading } =
    useGetAllWatchlistFilm({
      watchlistId: watchlistIds,
      tmdbId: movieId,
      enabled: !!watchlistIds && watchlistIds.length > 0, 
    });

  return (
    <div className=" w-full">
      <FilmDetailLayout
        watchlistData={getAllWatchlistData}
        watchlistFilmData={getAllWatchlistFilmData}
        media_type="movie"
        data={movieDetailsData}
        isLoading={
          isMovieDetailsLoading || isWatchlistLoading || isWatchlistFilmLoading
        }
      />
    </div>
  );
};

const MovieDetailPage = () => {
  return <PageContent />;
};

export default MovieDetailPage;
