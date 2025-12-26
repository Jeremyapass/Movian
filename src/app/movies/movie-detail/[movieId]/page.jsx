"use client";
import FilmDetailLayout from "@/components/Organism/layouts/FilmDetailLayout";
import { useGetMoviesDetails } from "@/hookAPI/TMDB/movies/UseGetMovieDetails";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const { movieId } = useParams();
  const { data: movieDetailsData, isLoading: isMovieDetailsLoading } =
    useGetMoviesDetails(movieId);
//GET SEMUA YANG FAV DI SINI. 
//lalu bandingankan getAllFavotireFilmsData.data.movie_cache.tmdb_movie_id dengan movieDetailsData.id
//KALAU ada berart isFavorite = true
  console.log(movieDetailsData);
  return (
    <div className=" w-full">
      <FilmDetailLayout
        media_type="movie"
        data={movieDetailsData}
        isLoading={isMovieDetailsLoading}
        //isFavorite={isFavorite}
      />
    </div>
  );
};

const MovieDetailPage = () => {
  return <PageContent />;
};

export default MovieDetailPage;
