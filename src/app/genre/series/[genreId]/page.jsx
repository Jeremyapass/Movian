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
      type="series"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
};

const GenreIdPage = () => {
  const { genreId } = useParams();

  return (
    <GenreDetailProvider genreId={genreId} type="series">
      <PageContent />
    </GenreDetailProvider>
  );
};

export default GenreIdPage;
