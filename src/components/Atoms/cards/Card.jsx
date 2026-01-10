import React, { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { fonts } from "@/fonts/fonts";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";

const Card = ({
  filmName,
  filmReleaseDate,
  filmImages,
  isLoading,
  onClick,
  layout = "default",
}) => {
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return <CardSkeleton layout={layout} />;
  }

  const hasValidImage =
    filmImages &&
    filmImages !== "null" &&
    !filmImages.includes("/null") &&
    !filmImages.includes("/undefined") &&
    !imageError;

  const isLayoutFull = layout === "layoutfull";

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex flex-col gap-[11px] cursor-pointer shrink-0",
        isLayoutFull ? "w-full" : "w-[270px]"
      )}
    >
      <div className="relative w-full overflow-hidden rounded-[12px] bg-[#0D0D0D]">
        <div className="pt-[140.7%]" />

        {hasValidImage ? (
          <Image
            src={filmImages}
            alt="MovieImages"
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="auto"
            loading="eager"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`${fonts.clash.className} text-[32px] font-semibold bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
            >
              MVN.
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-transparent hover:bg-[#2A2A2A66]/40 transition-all duration-300" />
      </div>

      {/* TEXT */}
      <div className="min-h-[120px]">
        <h1
          className={`${fonts.clash.className} font-semibold text-[24px] line-clamp-1`}
        >
          {filmName}
        </h1>
        <p>{filmReleaseDate}</p>
      </div>
    </div>
  );
};

export default Card;
