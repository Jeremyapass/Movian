"use client";
import WatchlistFilmLayoutFull from "@/components/Organism/layouts/WatchlistFilmLayoutFull";
import { useWatchlist, WatchlistProvider } from "@/provider/watchlistProvider";
import { useParams } from "next/navigation";
import React from "react";

const PageContent = () => {
  const {
    data,
    isWatchlistFilmLoading,
    isWatchlistPageLoading,
    isWatchlistLoading,
    handleFilter,
    filterType,
  } = useWatchlist();

  console.log(data);
  return (
    <WatchlistFilmLayoutFull
      data={data}
      isLoading={
        isWatchlistFilmLoading || isWatchlistPageLoading || isWatchlistLoading
      }
      handleFilter={handleFilter}
      filterType={filterType}
    />
  );
};
const WatchlistDetailPage = () => {
  const { watchlistId } = useParams();
  return (
    <WatchlistProvider watchlistId={watchlistId}>
      <PageContent watchlistId={watchlistId} />
    </WatchlistProvider>
  );
};

export default WatchlistDetailPage;
