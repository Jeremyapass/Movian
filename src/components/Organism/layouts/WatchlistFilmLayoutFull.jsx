import Card from "@/components/Atoms/cards/Card";
import FilmFilters from "@/components/Atoms/FilmFilters";
import Pagination from "@/components/Atoms/Pagination";
import { fonts } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import React from "react";

const WatchlistFilmLayoutFull = ({
  watchlistData,
  dataFilms,
  isLoading,
  handleFilter,
  filterType,
  currentPage,
  onPageChange,
}) => {
  const router = useRouter();
  const totalPages = dataFilms?.totalPages || 1;

  return (
    <div className="w-full flex flex-col gap-10">
      <Header
        handleFilter={handleFilter}
        filterType={filterType}
        dataFilms={dataFilms}
        watchlistData={watchlistData}
      />

      {isLoading ? (
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {[...Array(12)].map((_, i) => (
            <Card key={i} layout="layoutfull" isLoading />
          ))}
        </div>
      ) : dataFilms?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <p
            className={`${fonts.clash.className} text-[28px] font-semibold text-gray-300`}
          >
            {watchlistData?.data?.name} masih kosong
          </p>
          <p className="text-gray-500">
            Tambahkan film atau series ke {watchlistData?.data?.name} untuk
            melihatnya di sini
          </p>
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
              filmImages={`https://image.tmdb.org/t/p/w500${item.movie_cache.poster_path}`}
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

const Header = ({ handleFilter, filterType, watchlistData }) => {
  return (
    <div className="text-white flex justify-between items-end">
      <div className="flex flex-col">
        <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
          {watchlistData?.data?.name}
        </h1>
        <p>
          Terdapat {watchlistData?.data?.total_movie} movies, dan{" "}
          {watchlistData?.data?.total_series} series
        </p>
      </div>

      <FilmFilters
        filterType={filterType}
        onClick={(e) => handleFilter(e.target.value)}
      />
    </div>
  );
};

export default WatchlistFilmLayoutFull;
