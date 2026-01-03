"use client";
import { useDeleteWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useDeleteWatchlist";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import React, { createContext, useContext, useMemo, useState } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { data: getWatchlistData, isLoading: isWatchlistLoading } =
    useGetWatchlist();
  const { mutate: deleteWatchlist, isPending: isDeletingWatchlistPending } =
    useDeleteWatchlist();

  const handleDeleteWatchlist = (e, id) => {
    e.stopPropagation();
    deleteWatchlist(id, {
      onSuccess: () => {
        console.log("Watchlist deleted successfully");
      },
    });
  };

  return (
    <WatchlistContext.Provider
      value={{
        getWatchlistData,

        isWatchlistLoading,
        isDeletingWatchlistPending,
        handleDeleteWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
