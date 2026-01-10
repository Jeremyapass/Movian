"use client";
import { useDeleteWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useDeleteWatchlist";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import React, { createContext, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: watchlistResponse, isLoading: isWatchlistLoading } =
    useGetWatchlist({ page: currentPage });
  const { mutate: deleteWatchlist, isPending: isDeletingWatchlistPending } =
    useDeleteWatchlist();

  const getWatchlistData = watchlistResponse?.data || [];
  const totalPages = watchlistResponse?.totalPages || 1;
  const totalCount = watchlistResponse?.count || 0;

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

  return (
    <WatchlistContext.Provider
      value={{
        getWatchlistData,
        totalPages,
        totalCount,
        currentPage,

        isWatchlistLoading,
        isDeletingWatchlistPending,
        handleDeleteWatchlist,
        handlePageChange,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
