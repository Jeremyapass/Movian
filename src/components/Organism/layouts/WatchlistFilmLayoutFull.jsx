import Card from "@/components/Atoms/cards/Card";
import FilmFilters from "@/components/Atoms/FilmFilters";
import Pagination from "@/components/Atoms/Pagination";
import { fonts } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import React from "react";

const WatchlistFilmLayoutFull = ({
  data,
  isLoading,
  handleFilter,
  filterType,
}) => {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col gap-10">
      <Header handleFilter={handleFilter} filterType={filterType} data={data} />

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
            NamaWatchlist masih kosong
          </p>
          <p className="text-gray-500">
            Tambahkan film atau series ke NamaWatchlist untuk melihatnya di sini
          </p>
        </div>
      ) : (
        /* DATA */
        <div className="w-full grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center gap-2">
          {data.map((item, index) => (
            <Card
              key={index}
              layout="layoutfull"
              filmName={item.title || item.name}
              filmReleaseDate={item.release_date || item.first_air_date}
              filmImages={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              onClick={() =>
                router.push(
                  item.type === "movie"
                    ? `/movies/movie-detail/${item.id}`
                    : `/series/series-detail/${item.id}`
                )
              }
            />
          ))}
        </div>
      )}

      <Pagination />
    </div>
  );
};

const Header = ({ handleFilter, filterType, data }) => {
  const movieCount = data?.filter((i) => i.media_type === "movie").length || 0;
  const seriesCount = data?.filter((i) => i.media_type === "tv").length || 0;

  return (
    <div className="text-white flex justify-between items-end">
      <div className="flex flex-col">
        <h1 className={`${fonts.clash.className} font-semibold text-4xl`}>
          Judul Watchlist
        </h1>
        <p>
          Terdapat {movieCount} movies, dan {seriesCount} series
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
