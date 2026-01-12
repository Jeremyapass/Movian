"use client";
import { fonts } from "@/fonts/fonts";
import React from "react";
import { Button } from "../ui/button";
import SearchBar from "../Atoms/SearchBar";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import NavbarSkeleton from "../Skeletons/NavbarSkeleton";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";

const Navbar = () => {
  const currentPath = usePathname();
  const route = useRouter();
  const { data: accountData, isLoading } = useGetAccountDetail();

  const isLoggedIn = !!accountData;

  if (currentPath.includes("/login") || currentPath.includes("/signup")) {
    return null;
  }

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <div className="fixed backdrop-blur-[2px] top-0 z-50 bg-[rgba(13,13,13,0.10)] rounded-b-[24px] text-white flex justify-center items-center gap-3 p-[24px]">
      <div className="flex items-center justify-center pl-[24px] pr-[8px] py-[8px] bg-[#1A1A1A] rounded-[16px] gap-[28px]">
        <span
          className={`${fonts.clash.className} cursor-pointer font-semibold text-[24px] bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
          onClick={() => route.push("/")}
        >
          MVN.
        </span>
        <div className="gap-[8px] flex items-center justify-center">
          <Button
            onClick={() => route.push("/")}
            className={clsx(
              currentPath === "/"
                ? "bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent "
                : " ",
              "text-md"
            )}
          >
            Utama
          </Button>
          <Button
            onClick={() => route.push("/movies")}
            className={clsx(
              currentPath.startsWith("/movies")
                ? "bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent "
                : " ",
              "text-md"
            )}
          >
            Film
          </Button>
          <Button
            onClick={() => route.push("/series")}
            className={clsx(
              currentPath.startsWith("/series")
                ? "bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent "
                : " ",
              "text-md"
            )}
          >
            Series
          </Button>
          <Button
            onClick={() => route.push("/genre")}
            className={clsx(
              currentPath === "/genre"
                ? "bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent "
                : " ",
              "text-md"
            )}
          >
            Genre
          </Button>
          <SearchBar />
        </div>
      </div>
      {!isLoggedIn ? (
        <div className="flex items-center justify-center gap-4 bg-[#1A1A1A] px-4 py-[12px]  rounded-[16px]">
          <Button
            className={"border-[1px] border-[#2E2E2E]"}
            onClick={() => route.push("/login")}
          >
            Masuk
          </Button>
          <Button variant={"purple"} onClick={() => route.push("/signup")}>
            Daftar
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-[10px] bg-[#1A1A1A] px-[8px] py-[12px]  rounded-[16px]">
          <Button
            onClick={() => route.push("/watchlist")}
            className={clsx(
              currentPath === "/watchlist"
                ? "bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent "
                : " ",
              "text-md"
            )}
          >
            Watchlist
          </Button>
          <Button
            onClick={() => route.push("/favorite")}
            className={clsx(
              currentPath === "/favorite"
                ? "bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent "
                : " ",
              "text-md"
            )}
          >
            Favorite
          </Button>
          {accountData?.profile_picture ? (
            <Image
              onClick={() => route.push("/profile")}
              className="rounded-full cursor-pointer object-cover"
              src={accountData.profile_picture}
              alt="Profile"
              width={40}
              height={40}
            />
          ) : (
            <div className="rounded-full cursor-pointer flex items-center justify-center w-[40px] h-[40px] bg-[#2F2F2F]">
              <span
                onClick={() => route.push("/profile")}
                className={`${fonts.clash.className} h-[40px] w-[40px] bg-gradient-to-r text-[10px] flex justify-center items-center font-semibold from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
              >
                MVN.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
