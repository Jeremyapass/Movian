import Card from "@/components/Atoms/cards/Card";
import Pagination from "@/components/Atoms/Pagination";
import { useRouter } from "next/navigation";
import React from "react";

const FilmLayoutFull = ({ data, isLoading, type }) => {
  const route = useRouter();
  const mediaConfig = {
    movie: {
      name: (d) => d.title,
      date: (d) => d.release_date,
      path: (id) => `/movies/movie-detail/${id}`,
    },
    series: {
      name: (d) => d.name,
      date: (d) => d.first_air_date,
      path: (id) => `/series/series-detail/${id}`,
    },
    X: {
      name: (d) => d.x_name,  
      date: (d) => d.x_date,
      path: (id) => `/x/x-detail/${id}`,
    },
  };
  const config = mediaConfig[type];

  console.log(data);

  return (
    <div className="flex w-full flex-col">
      <div className="w-full grid grid-cols-4  md:grid-cols-5  lg:grid-cols-6 justify-items-center gap-2">
        {isLoading
          ? [...Array(12)].map((_, i) => (
              <Card layout={"layoutfull"} key={i} isLoading={true} />
            ))
          : data?.map((data, index) => (
              <Card
                layout={"layoutfull"}
                key={index}
                filmName={config.name(data)}
                filmReleaseDate={config.date(data)}
                filmImages={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                onClick={() => route.push(config.path(data.id))}
              />
            ))}
      </div>

      <Pagination />
    </div>
  );
};

export default FilmLayoutFull;
