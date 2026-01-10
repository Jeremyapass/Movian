"use client";
import FilmLayoutFull from "@/components/Organism/layouts/FilmLayoutFull";
import {
  GenreDetailProvider,
  useGenreDetail,
} from "@/provider/genreDetailProvider";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const { data, isLoading, currentPage, totalPages, handlePageChange } =
    useGenreDetail();

  return (
    <FilmLayoutFull
      data={data}
      isLoading={isLoading}
      type="movie"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

const GenreIdPage = () => {
  const { genreId } = useParams();

  return (
    <GenreDetailProvider genreId={genreId} type="movie">
      <PageContent />
    </GenreDetailProvider>
  );
};

export default GenreIdPage;
