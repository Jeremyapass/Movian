"use client";
import AddWatchListButton from "@/components/Atoms/buttons/AddWatchListButton";
import Card from "@/components/Atoms/cards/Card";
import WatchListCard from "@/components/Atoms/cards/WatchListCard";
import Pagination from "@/components/Atoms/Pagination";
import { fonts } from "@/fonts/fonts";
import { useRoot } from "@/provider/rootProvider";
import { useWatchlist } from "@/provider/watchlistProvider";
import { useRouter } from "next/navigation";
import React from "react";

const WatchlistLayoutFull = ({
  data,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}) => {
  const router = useRouter();
  const { handleDeleteWatchlist, isDeletingWatchlistPending } = useWatchlist();

  return (
    <div className="w-full flex flex-col gap-10">
      <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
        Watchlist ({totalCount || 0})
      </h1>

      <AddWatchListButton />

      {isLoading ? (
        /* LOADING */
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {[...Array(12)].map((_, i) => (
            <WatchListCard key={i} isLoading={true} layout="layoutfull" />
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
            <WatchListCard
              key={item.id}
              data={item}
              layout="layoutfull"
              onClick={() => router.push(`/watchlist/${item.id}`)}
              onClickDelete={(e) => handleDeleteWatchlist(e, item.id)}
              isDeletingWatchlistPending={isDeletingWatchlistPending}
            />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default WatchlistLayoutFull;
