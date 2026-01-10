import React from "react";
import { fonts } from "@/fonts/fonts";
import clsx from "clsx";
import Image from "next/image";
import MoreButton from "@/components/Atoms/buttons/MoreButton";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";

const WatchListCard = ({
  data,
  onClick,
  onClickDelete,
  isDeletingWatchlistPending,
  layout = "carousel", // "carousel" atau "layoutfull"
  isLoading,
}) => {
  const name = data?.name
  const moviesCount = data?.total_movie 
  const seriesCount = data?.total_series
  const imagePath = data?.picture_path;

  const isCarousel = layout === "carousel";

  if (isLoading) {
    return <CardSkeleton layout={layout} />;
  }

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative flex flex-col gap-[11px] group cursor-pointer",
        isCarousel ? "w-[270px]" : "w-full"
      )}
    >
      {/* More Button - only show in layoutfull */}
      {!isCarousel && onClickDelete && (
        <div
          className="absolute top-2 right-2 z-40"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreButton
            watchlistData={data}
            onClickDelete={onClickDelete}
            isDeletingWatchlistPending={isDeletingWatchlistPending}
          />
        </div>
      )}

      {/* IMAGE */}
      <div
        className={clsx(
          "relative rounded-[12px] flex items-center justify-center overflow-hidden bg-[#0D0D0D]",
          isCarousel ? "w-[270px] h-[340px]" : "w-full aspect-[27/38]"
        )}
      >
        {imagePath ? (
          <Image
            src={imagePath}
            alt={name}
            fill
            priority={!isCarousel}
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
      <div
        className={clsx(
          "flex flex-col transition-all duration-300 group-hover:text-[#7B61FF]",
          !isCarousel && "min-h-[120px]"
        )}
      >
        <h1
          className={`${fonts.clash.className} font-semibold text-[24px] line-clamp-1`}
        >
          {name}
        </h1>

        <p
          className={`${fonts.hanken.className} ${isCarousel ? "" : "text-sm"}`}
        >
          {moviesCount} Movies | {seriesCount} Series
        </p>
      </div>
    </div>
  );
};
export default WatchListCard;
