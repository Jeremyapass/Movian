"use client";
import WatchlistLayoutFull from "@/components/Organism/layouts/WatchlistLayoutFull";
import { useWatchlist, WatchlistProvider } from "@/provider/watchlistProvider";
import React from "react";

const PageContent = () => {
  const { watchlistData, isWatchlistPageLoading } = useWatchlist();
  // console.log(watchlistData);
  return (
    <WatchlistLayoutFull
      data={watchlistData}
      isLoading={isWatchlistPageLoading}
    />
  );
};

const WatchlistPage = () => {
  return (
    <WatchlistProvider>
      <PageContent />
    </WatchlistProvider>
  );
};

export default WatchlistPage;
