"use client";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";
import React, { createContext, useContext } from "react";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </RootContext.Provider>
  );
};

export const useRoot = () => useContext(RootContext);
