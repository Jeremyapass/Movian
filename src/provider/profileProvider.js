"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import { useGetAllFavoriteFilms } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetAllFavoriteFilms";
import { useGetWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useGetAllWatchlist";
import React, { createContext, useContext } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const {
    data: getAllFavoriteFilmsData,
    isLoading: isAllFavoriteFilmsLoading,
  } = useGetAllFavoriteFilms({ page: 1 });

  const { data: getWatchlistData, isLoading: isWatchlistLoading } =
    useGetWatchlist();

  return (
    <ProfileContext.Provider
      value={{
        getAllFavoriteFilmsData,
        getWatchlistData,

        isWatchlistLoading,
        isAllFavoriteFilmsLoading,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
