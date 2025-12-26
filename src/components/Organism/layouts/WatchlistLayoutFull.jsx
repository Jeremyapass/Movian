"use client";

import Card from "@/components/Atoms/cards/Card";
import Pagination from "@/components/Atoms/Pagination";
import { Button } from "@/components/ui/button";
import { fonts } from "@/fonts/fonts";
import clsx from "clsx";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const WatchlistLayoutFull = ({ data = [], isLoading }) => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-10">
      <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
        Watchlist (JumlahWatchlist)
      </h1>

      <Button
        className={`flex items-center gap-1 w-fit bg-[#7B61FF] hover:bg-[#7B61FF]/80 -mb-[25px]`}
      >
        Watchlist Baru <Plus />
      </Button>
      {/* 🔥 LOADING */}
      {isLoading ? (
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {[...Array(12)].map((_, i) => (
            <Card key={i} layout="layoutfull" isLoading />
          ))}
        </div>
      ) : data.length === 0 ? (
        /* EMPTY */
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <p
            className={`${fonts.clash.className} text-[28px] font-semibold text-gray-300`}
          >
            Watchlist masih kosong
          </p>
          <p className="text-gray-500">
            Tambahkan film atau series ke watchlist untuk melihatnya di sini
          </p>
        </div>
      ) : (
        /* DATA */
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {data.map((item) => (
            <WatchlistCard
              key={item.id}
              name={item.name}
              moviesCount={item.movies_count}
              seriesCount={item.series_count}
              imagePath={item.picture_path}
              onClick={() => router.push(`/watchlist/${item.id}`)}
            />
          ))}
        </div>
      )}

      <Pagination />
    </div>
  );
};

const WatchlistCard = ({
  name,
  moviesCount,
  seriesCount,
  imagePath,
  onClick,
}) => {
  const imageUrl = imagePath
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/watchlist-images/${imagePath}`
    : null;

  return (
    <div
      onClick={onClick}
      className={clsx("flex flex-col gap-[11px] group cursor-pointer w-full")}
    >
      {/* IMAGE */}
      <div className="relative rounded-[12px] flex items-center justify-center  overflow-hidden w-full aspect-[27/38] bg-[#0D0D0D]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <span
            className={`${fonts.clash.className} bg-gradient-to-r text-[32px] font-semibold from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
          >
            MVN.
          </span>
        )}

        <div className="absolute inset-0 bg-transparent group-hover:bg-black/40 transition-all duration-300" />
      </div>

      {/* TEXT */}
      <div className="flex flex-col min-h-[120px] transition-all duration-300 group-hover:text-[#7B61FF]">
        <h1
          className={`${fonts.clash.className} font-semibold text-[24px] line-clamp-1`}
        >
          {name}
        </h1>

        <p className={`${fonts.hanken.className} text-sm`}>
          {moviesCount} Movies | {seriesCount} Series
        </p>
      </div>
    </div>
  );
};

export default WatchlistLayoutFull;
