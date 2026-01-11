"use client";
import WatchlistFilmLayoutFull from "@/components/Organism/layouts/WatchlistFilmLayoutFull";
import {
  usePublicWatchlistFilm,
  PublicWatchlistFilmProvider,
} from "@/provider/publicWatchlistFilmProvider";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const {
    dataFilms,
    isLoading,
    handleFilter,
    filterType,
    getWatchlistData,
    page,
    handlePageChange,
    isPublicView,
  } = usePublicWatchlistFilm();

  return (
    <WatchlistFilmLayoutFull
      watchlistData={getWatchlistData}
      dataFilms={dataFilms}
      isLoading={isLoading}
      handleFilter={handleFilter}
      filterType={filterType}
      currentPage={page}
      onPageChange={handlePageChange}
      isPublicView={isPublicView}
    />
  );
};

const PublicWatchlistPage = () => {
  const { publicId } = useParams();
  return (
    <PublicWatchlistFilmProvider publicId={publicId}>
      <PageContent />
    </PublicWatchlistFilmProvider>
  );
};

export default PublicWatchlistPage;
