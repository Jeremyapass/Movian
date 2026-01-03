"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import React, { createContext, useContext } from "react";

const RootContext = createContext();

export const RootProvider = ({ children }) => {
  const { data: getAccountDetailData, isLoading: isGetAccountDetailLoading } =
    useGetAccountDetail();
  return (
    <RootContext.Provider
      value={{
        getAccountDetailData,
        isGetAccountDetailLoading,
      }}
    >
      {children}
    </RootContext.Provider>
  );
};

export const useRoot = () => useContext(RootContext);
