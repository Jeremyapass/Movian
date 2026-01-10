"use client";
import ProfileBackground from "@/components/Atoms/ProfileBackground";
import { ProfileProvider, useProfile } from "@/provider/profileProvider";
import React from "react";
import ahay from "../../../public/avatar-image.png";
import Image from "next/image";
import UlasanProfileLayout from "@/components/Molecules/layouts/UlasanProfileLayout";
import WatchlistCarouselLayout from "@/components/Molecules/carouselLayout/WatchlistCarouselLayout";
import { Settings } from "lucide-react";
import { fonts } from "@/fonts/fonts";
import { Button } from "@/components/ui/button";
import FavoriteCarouselLayout from "@/components/Molecules/carouselLayout/FavoriteCarouselLayout";
import { useRoot } from "@/provider/rootProvider";
import UpdateProfileButton from "@/components/Atoms/buttons/UpdateProfileButton";

const PageContent = () => {
  const {
    getAllFavoriteFilmsData,
    getWatchlistData,

    isWatchlistLoading,
    isAllFavoriteFilmsLoading,
  } = useProfile();

  const { getAccountDetailData, isGetAccountDetailLoading } = useRoot();

  return (
    <div className=" w-full h-full flex flex-col">
      <div className="flex flex-col ">
        <ProfileBackground />
        <span className="mb-[32px]" />
        {isGetAccountDetailLoading ? (
          <HeaderSkeleton />
        ) : (
          <Header data={getAccountDetailData} />
        )}
        <span className="mb-[32px]" />
        <div className=" flex flex-col gap-8">
          <FavoriteCarouselLayout
            title={"Favorit"}
            data={getAllFavoriteFilmsData}
            isLoading={isAllFavoriteFilmsLoading}
          />
          <WatchlistCarouselLayout
            title={"Watchlist"}
            data={getWatchlistData?.data}
            isLoading={isWatchlistLoading}
          />
          {/* <UlasanProfileLayout /> */}
        </div>
      </div>
    </div>
  );
};

const Header = ({ data }) => {
  return (
    <div className="flex gap-6">
      <div className="w-[164px] h-[164px] flex items-center justify-center bg-[#1A1A1A] rounded-[24px] overflow-hidden">
        {data?.profile_picture ? (
          <Image
            src={data.profile_picture}
            alt="Profile"
            width={164}
            height={164}
            className="w-[164px] h-[164px] object-cover"
          />
        ) : (
          <span
            className={`${fonts.clash.className} bg-gradient-to-r text-[32px] font-semibold from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
          >
            MVN.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <UpdateProfileButton />
        {data?.bio?.trim() !== "" && <p>{data?.bio}</p>}

        <p>
          {data?.watchlist_count} watchlist, {data?.favorite_count} favorit,{" "}
          {data?.review_count} ulasan
        </p>
      </div>
    </div>
  );
};

const HeaderSkeleton = () => {
  return (
    <div className="flex gap-6 animate-pulse">
      <div className="w-[164px] h-[164px] rounded-[24px] bg-[#2F2F2F]" />

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex gap-2 items-center">
          <div className="h-[38px] w-[120px] bg-[#2F2F2F] rounded-md" />
          <div className="h-[38px] w-[38px] bg-[#2F2F2F] rounded-md" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-[20px] w-[300px] bg-[#2F2F2F] rounded-md" />
          <div className="h-[20px] w-[250px] bg-[#2F2F2F] rounded-md" />
        </div>

        <div className="h-[20px] w-[280px] bg-[#2F2F2F] rounded-md" />
      </div>
    </div>
  );
};

const AccountPage = () => {
  return (
    <ProfileProvider>
      <PageContent />
    </ProfileProvider>
  );
};
export default AccountPage;
