"use client";
import ProfileBackground from "@/components/Atoms/ProfileBackground";
import { ProfileProvider, useProfile } from "@/provider/profileProvider";
import React from "react";
import ahay from "../../../public/avatar-image.png";
import Image from "next/image";
import UlasanProfileLayout from "@/components/Molecules/layouts/UlasanProfileLayout";
import WatchlistLayout from "@/components/Molecules/carouselLayout/WatchlistCarouselLayout";
import { Settings } from "lucide-react";
import { fonts } from "@/fonts/fonts";
import { Button } from "@/components/ui/button";
import FavoriteCarouselLayout from "@/components/Molecules/carouselLayout/FavoriteCarouselLayout";

const PageContent = () => {
  const {} = useProfile();

  return (
    <div className=" w-full h-full flex flex-col">
      <div className="flex flex-col ">
        <ProfileBackground />
        <span className="mb-[32px]" />
        <div className="flex gap-6">
          <Image
            src={ahay}
            alt="Avatar"
            width={164}
            height={164}
            className="w-[164px] h-[164px] rounded-[24px] object-cover  "
          />

          <div className="flex flex-col gap-4">
            <div
              className={`flex gap-2 items-center text-[30px] font-semibold ${fonts.clash.className}`}
            >
              Jerry
              <Button className={`h-full `}>
                <Settings width={30} height={30} />
              </Button>
            </div>

            <p>i watch thriller</p>
            <p>1728 film, 3 watchlist, 28 favorit, 142 ulasan</p>
          </div>
        </div>
        <span className="mb-[32px]" />
        <div className=" flex flex-col gap-8">
          <FavoriteCarouselLayout title={"Favorit"} />
          <WatchlistLayout title={"Watchlist"} />
          <UlasanProfileLayout />
        </div>
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
