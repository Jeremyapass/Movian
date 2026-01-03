"use client";
import WatchlistLayoutFull from "@/components/Organism/layouts/WatchlistLayoutFull";
import { useWatchlist, WatchlistProvider } from "@/provider/watchlistProvider";
import React from "react";

const PageContent = () => {
  const { getWatchlistData, isWatchlistLoading } = useWatchlist();

  return (
    <WatchlistLayoutFull
      data={getWatchlistData}
      isLoading={isWatchlistLoading}
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
