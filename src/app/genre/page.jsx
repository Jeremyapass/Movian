"use client";
import FilmFilters from "@/components/Atoms/FilmFilters";
import { GenreProvider, useGenre } from "@/provider/genreProvider";
import React from "react";
import { useRouter } from "next/navigation";
import { fonts } from "@/fonts/fonts";

const GenreItem = ({ genre, filterType }) => {
  const router = useRouter();

  const handleClick = () => {
    const path =
      filterType === "series"
        ? `/genre/series/${genre.id}`
        : `/genre/movie/${genre.id}`;
    router.push(path);
  };

  return (
    <div
      className="h-[60px] w-full bg-[#1A1A1A] hover:bg-[#7B61FF]
                 transition-colors duration-200 rounded-lg
                 flex items-center justify-center cursor-pointer
                 font-medium text-lg"
      onClick={handleClick}
    >
      {genre.name}
    </div>
  );
};

const GenreSkeleton = ({ count = 8 }) => {
  return (
    <div className="w-full flex flex-col gap-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-32 bg-[#2A2A2A] rounded" />
        <div className="h-4 w-64 bg-[#2A2A2A] rounded" />
      </div>

      <div className="w-full grid grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-[60px] w-full bg-[#2A2A2A] rounded-lg" />
        ))}
      </div>
    </div>
  );
};

const PageContent = () => {
  const { genreData, isLoading, filterType, handleFilter } = useGenre();

  if (isLoading) {
    return <GenreSkeleton count={8} />;
  }

  const genres = genreData?.genres || [];
  const itemsPerRow = 4;
  const totalRows = Math.ceil(genres.length / itemsPerRow);
  const lastRowStart = (totalRows - 1) * itemsPerRow;

  const mainItems = genres.slice(0, lastRowStart);
  const lastRowItems = genres.slice(lastRowStart);

  const handleFilterClick = (e) => {
    handleFilter(e.target.value);
  };

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
            Genre
          </h1>
          <p>Temukan film dan series dari berbagai genre</p>
        </div>

        <div className="self-end">
          <FilmFilters
            onClick={handleFilterClick}
            filterType={filterType}
            hideAll={true}
          />
        </div>
      </div>

      {/* Genre List */}
      <div className="w-full flex flex-col gap-4">
        {mainItems.length > 0 && (
          <div className="w-full grid grid-cols-4 gap-4">
            {mainItems.map((genre) => (
              <GenreItem key={genre.id} genre={genre} filterType={filterType} />
            ))}
          </div>
        )}

        {lastRowItems.length > 0 && (
          <div className="w-full flex justify-center gap-4">
            {lastRowItems.map((genre) => (
              <div key={genre.id} className="w-[calc(25%-12px)]">
                <GenreItem genre={genre} filterType={filterType} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GenrePage = () => {
  return (
    <GenreProvider>
      <PageContent />
    </GenreProvider>
  );
};

export default GenrePage;
