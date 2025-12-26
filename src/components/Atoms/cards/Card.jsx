import React from "react";
import RateButton from "../buttons/RateButton";
import Image from "next/image";
import { fonts } from "@/fonts/fonts";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import clsx from "clsx";
import AddFavButton from "../buttons/AddFavButton";


const Card = ({
  filmName,
  filmReleaseDate,
  filmImages,
  isLoading,
  onClick,
  layout = "default",
  type,
}) => {
  if (isLoading) {
    return <CardSkeleton layout={layout} />;
  }

  const isLayoutFull = layout === "layoutfull";

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex flex-col relative gap-[11px]  group cursor-pointer",
        isLayoutFull ? "w-full" : "w-[270px]"
      )}
    >
      {/* <div className=" absolute right-2 top-2 bg  z-10 ">
        <AddFavButton
          onCard={true}
          type={type}
          tmdbMovieId={tmdbMovieId}
          name={filmName}
          posterPath={filmImages}
          dateRelease={filmReleaseDate}
        />
      </div> */}
      {/* IMAGE */}
      <div
        className={clsx(
          "relative rounded-[12px] overflow-hidden",
          isLayoutFull ? "w-full aspect-[27/38]" : "w-[270px] h-[380px]"
        )}
      >
        <Image
          src={filmImages}
          alt="MovieImages"
          fill={isLayoutFull}
          width={!isLayoutFull ? 270 : undefined}
          height={!isLayoutFull ? 380 : undefined}
          sizes={
            isLayoutFull
              ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              : "270px"
          }
          className="object-cover transition-all duration-300 w-full h-full"
          loading="lazy"
        />

        <div className="absolute rounded-[12px]  inset-0 bg-transparent group-hover:bg-[#2A2A2A66]/40 transition-all duration-300" />
      </div>

      <div className="flex flex-col min-h-[120px] transition-all duration-300 group-hover:text-[#7B61FF]">
        <RateButton rateNumber={75} clickable={false} />

        <h1
          className={`${fonts.clash.className} font-semibold text-[24px] line-clamp-1`}
        >
          {filmName}
        </h1>

        <p className={`${fonts.hanken.className}`}>{filmReleaseDate}</p>
      </div>
    </div>
  );
};

export default Card;
