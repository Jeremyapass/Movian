"use client";
import Card from "@/components/Atoms/cards/Card";
import FilmFilters from "@/components/Atoms/FilmFilters";
import Pagination from "@/components/Atoms/Pagination";
import { fonts } from "@/fonts/fonts";
import { SearchProvider, useSearch } from "@/provider/searchProvider";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const PageContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const router = useRouter();

  const {
    searchData,
    isLoading,
    filterType,
    handleFilter,
    page,
    totalPages,
    handlePageChange,
  } = useSearch();

  const handleFilterClick = (e) => {
    handleFilter(e.target.value);
  };

  // Helper untuk mendapatkan config berdasarkan media type
  const getMediaConfig = (item) => {
    // Jika ada media_type dari combined results
    const mediaType = item.media_type || filterType;

    if (mediaType === "tv" || mediaType === "series") {
      return {
        name: item.name,
        date: item.first_air_date,
        path: `/series/series-detail/${item.id}`,
      };
    }

    // Default ke movie
    return {
      name: item.title,
      date: item.release_date,
      path: `/movies/movie-detail/${item.id}`,
    };
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
            Hasil Pencarian
          </h1>
          <p>
            Menampilkan hasil untuk &quot;{query}&quot;
            {searchData.total_results > 0 && (
              <span> ({searchData.total_results} hasil)</span>
            )}
          </p>
        </div>

        <div className="self-end">
          <FilmFilters onClick={handleFilterClick} filterType={filterType} />
        </div>
      </div>

      {/* Results */}
      {!isLoading && searchData.results.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-2xl text-[#999]">Tidak ada hasil ditemukan</p>
          <p className="text-[#666]">Coba gunakan kata kunci lain</p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-6">
          <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
            {isLoading
              ? [...Array(12)].map((_, i) => (
                  <Card layout={"layoutfull"} key={i} isLoading={true} />
                ))
              : searchData.results.map((item, index) => {
                  const config = getMediaConfig(item);
                  const imageUrl = item.poster_path
                    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                    : null;
                  return (
                    <Card
                      layout={"layoutfull"}
                      key={`${item.id}-${index}`}
                      tmdbMovieId={item.id}
                      filmName={config.name}
                      filmReleaseDate={config.date}
                      filmImages={imageUrl}
                      onClick={() => router.push(config.path)}
                    />
                  );
                })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

const SearchResultPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  if (!query) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-2xl text-[#999]">Masukkan kata kunci pencarian</p>
      </div>
    );
  }

  return (
    <SearchProvider searchQuery={query}>
      <PageContent />
    </SearchProvider>
  );
};

const SearchResultPageWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full flex flex-col items-center justify-center py-20">
          <p className="text-xl text-[#999]">Loading...</p>
        </div>
      }
    >
      <SearchResultPage />
    </Suspense>
  );
};

export default SearchResultPageWrapper;
