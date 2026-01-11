"use client";
import { useDeleteWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useDeleteWatchlist";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import React, { createContext, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [privacyFilter, setPrivacyFilter] = useState("all");

  const { data: watchlistResponse, isLoading: isWatchlistLoading } =
    useGetWatchlist({ page: currentPage });
  const { mutate: deleteWatchlist, isPending: isDeletingWatchlistPending } =
    useDeleteWatchlist();

  const rawWatchlistData = watchlistResponse?.data || [];

  // Filter watchlist based on privacy
  const getWatchlistData = useMemo(() => {
    if (privacyFilter === "all") return rawWatchlistData;
    if (privacyFilter === "public")
      return rawWatchlistData.filter((item) => item.is_public === true);
    if (privacyFilter === "private")
      return rawWatchlistData.filter((item) => item.is_public === false);
    return rawWatchlistData;
  }, [rawWatchlistData, privacyFilter]);

  const totalPages = watchlistResponse?.totalPages || 1;
  const totalCount = getWatchlistData.length;

  const handleDeleteWatchlist = (e, id) => {
    e.stopPropagation();
    deleteWatchlist(id, {
      onSuccess: () => {
        toast.success("Watchlist berhasil dihapus!");
      },
      onError: () => {
        toast.error("Gagal menghapus watchlist. Silakan coba lagi.");
      },
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrivacyFilter = (type) => {
    setPrivacyFilter(type);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <WatchlistContext.Provider
      value={{
        getWatchlistData,
        totalPages,
        totalCount,
        currentPage,
        privacyFilter,

        isWatchlistLoading,
        isDeletingWatchlistPending,
        handleDeleteWatchlist,
        handlePageChange,
        handlePrivacyFilter,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
