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
    privacyFilter,
    handlePrivacyFilter,
  } = useWatchlist();

  return (
    <WatchlistLayoutFull
      data={getWatchlistData}
      isLoading={isWatchlistLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      totalCount={totalCount}
      privacyFilter={privacyFilter}
      handlePrivacyFilter={handlePrivacyFilter}
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
