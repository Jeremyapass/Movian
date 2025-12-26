"use client"
import { GenreProvider, useGenre } from '@/provider/genreProvider';
import React from 'react'

const PageContent = () => {
 const {movieListGenreData, isMovieListGenreLoading} = useGenre();

  return (
    <div>
        {movieListGenreData?.genres.map((genre) => (
          <div key={genre.id}>{genre.name}</div>
        ))}
    </div>
  )
}

const GenrePage = () => {
  return (
    <GenreProvider>
      <PageContent />
    </GenreProvider>
  );
};

export default GenrePage