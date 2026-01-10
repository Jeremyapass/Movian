"use client";
import WatchlistFilmLayoutFull from "@/components/Organism/layouts/WatchlistFilmLayoutFull";
import {
  useWatchlistFilm,
  WatchlistFilmProvider,
} from "@/provider/watchlistFilmProvider";
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
  } = useWatchlistFilm();

  return (
    <WatchlistFilmLayoutFull
      watchlistData={getWatchlistData}
      dataFilms={dataFilms}
      isLoading={isLoading}
      handleFilter={handleFilter}
      filterType={filterType}
      currentPage={page}
      onPageChange={handlePageChange}
    />
  );
};

const WatchlistDetailPage = () => {
  const { watchlistId } = useParams();
  return (
    <WatchlistFilmProvider watchlistId={watchlistId}>
      <PageContent watchlistId={watchlistId} />
    </WatchlistFilmProvider>
  );
};

export default WatchlistDetailPage;
