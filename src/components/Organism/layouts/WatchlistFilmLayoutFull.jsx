import UpdateWatchlistButton from "@/components/Atoms/buttons/UpdateWatchlistButton";
import Card from "@/components/Atoms/cards/Card";
import FilmFilters from "@/components/Atoms/FilmFilters";
import Pagination from "@/components/Atoms/Pagination";
import { fonts } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Lock, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const WatchlistFilmLayoutFull = ({
  watchlistData,
  dataFilms,
  isLoading,
  handleFilter,
  filterType,
  currentPage,
  onPageChange,
  isPublicView = false,
}) => {
  const router = useRouter();
  const totalPages = dataFilms?.totalPages || 1;
  const isPublic = watchlistData?.data?.is_public;

  return (
    <div className="w-full flex flex-col gap-10">
      <Header
        handleFilter={handleFilter}
        filterType={filterType}
        dataFilms={dataFilms}
        isPublicView={isPublicView}
        watchlistData={watchlistData}
        isLoading={isLoading}
      />

      {isLoading ? (
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {[...Array(12)].map((_, i) => (
            <Card key={i} layout="layoutfull" isLoading />
          ))}
        </div>
      ) : dataFilms?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          {isPublicView && isPublic === false ? (
            // Non-owner viewing private watchlist
            <>
              <div className="flex items-center gap-2">
                <Lock size={32} className="text-gray-400" />
                <p
                  className={`${fonts.clash.className} text-[28px] font-semibold text-gray-300`}
                >
                  Watchlist Private
                </p>
              </div>
              <p className="text-gray-500">
                Watchlist ini bersifat private dan tidak dapat dilihat
              </p>
            </>
          ) : (
            // Owner viewing their watchlist (empty) OR public empty watchlist
            <>
              <p
                className={`${fonts.clash.className} text-[28px] font-semibold text-gray-300`}
              >
                {watchlistData?.data?.name} masih kosong
              </p>
              <p className="text-gray-500">
                Tambahkan film atau series ke {watchlistData?.data?.name} untuk
                melihatnya di sini
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {dataFilms?.data?.map((item, index) => (
            <Card
              key={index}
              layout="layoutfull"
              movieCacheId={item.movie_cache_id}
              filmName={item.movie_cache.name}
              filmReleaseDate={item.movie_cache.date_release}
              filmImages={`https://image.tmdb.org/t/p/w342${item.movie_cache.poster_path}`}
              onClick={() =>
                router.push(
                  item.movie_cache.type === "movie"
                    ? `/movies/movie-detail/${item.movie_cache.tmdb_movie_id}`
                    : `/series/series-detail/${item.movie_cache.tmdb_movie_id}`
                )
              }
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

const Header = ({
  handleFilter,
  filterType,
  watchlistData,
  isPublicView,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  // console.log(watchlistData);

  const handleShare = () => {
    const publicId = watchlistData?.data?.public_id;
    if (!publicId) {
      toast.error("Public ID tidak ditemukan");
      return;
    }

    const shareUrl = `${window.location.origin}/watchlist/public/${publicId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isPublic = watchlistData?.data?.is_public;

  return (
    <div className="text-white flex justify-between items-end">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {isLoading ? (
            // Skeleton for title
            <div className="h-10 w-64 bg-gray-700 animate-pulse rounded-md"></div>
          ) : (
            <>
              <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
                {!isPublic && isPublicView
                  ? "Watchlist bukan untuk publik"
                  : watchlistData?.data?.name}
              </h1>

              {/* Lock Icon if Private */}
              {!isPublic && !isPublicView && (
                <div className="flex items-center gap-1 px-2 py-1 bg-[#2E2E2E] rounded-md text-sm text-gray-400">
                  <Lock size={14} />
                  <span>Private</span>
                </div>
              )}

              {/* Edit Button - Only show for owner (not public view) */}
              {!isPublicView && (
                <UpdateWatchlistButton
                  watchlistData={watchlistData?.data}
                  className="gap-2 px-3 py-2 hover:bg-[#2E2E2E] text-sm h-full"
                  buttonText=""
                />
              )}

              {/* Share Button - Always show for owner, hide if viewing public and it's private */}
            </>
          )}
        </div>

        {isLoading ? (
          // Skeleton for description
          <div className="h-5 w-48 bg-gray-700 animate-pulse rounded-md mt-2"></div>
        ) : !isPublic && isPublicView ? (
          "" // Jangan tampilkan deskripsi jika private & dilihat publik
        ) : (
          <h2 className="text-gray-400">{watchlistData?.data?.description}</h2>
        )}

        {!isPublicView && (
          <Button
            variant="ghost"
            onClick={handleShare}
            className=" w-fit mt-1 mb-2 gap-1 px-2 py-1 text-xs hover:bg-[#2E2E2E] rounded-md"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Tersalin" : "Bagikan"}
          </Button>
        )}
        {isLoading ? (
          // Skeleton for description
          <div className="h-5 w-48 bg-gray-700 animate-pulse rounded-md mt-2"></div>
        ) : !isPublic && isPublicView ? (
          ""
        ) : (
          <p>
            Terdapat {watchlistData?.data?.total_movie} movies, dan{" "}
            {watchlistData?.data?.total_series} series
          </p>
        )}
      </div>

      <FilmFilters
        filterType={filterType}
        onClick={(e) => handleFilter(e.target.value)}
      />
    </div>
  );
};

export default WatchlistFilmLayoutFull;
