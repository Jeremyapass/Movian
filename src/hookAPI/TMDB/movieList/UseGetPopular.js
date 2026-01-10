// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetPopular = (page = 1) => {
  return axios
    .get("/api/TMDB/movieList/get-popular", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetPopular = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getPopular", page],
    queryFn: () => GetPopular(page),
    enabled: enable,
  });
};
