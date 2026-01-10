"use client";
import WatchlistLayoutFull from "@/components/Organism/layouts/WatchlistLayoutFull";
import { useWatchlist, WatchlistProvider } from "@/provider/watchlistProvider";
import React from "react";

const PageContent = () => {
  const {
    getWatchlistData,
    isWatchlistLoading,
    currentPage,
    totalPages,
    handlePageChange,
    totalCount,
  } = useWatchlist();

  return (
    <WatchlistLayoutFull
      data={getWatchlistData}
      isLoading={isWatchlistLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalCount={totalCount}
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
