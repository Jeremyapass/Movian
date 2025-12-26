"use client";
import React, { createContext, useContext } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  return (
    <ProfileContext.Provider value={{}}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
