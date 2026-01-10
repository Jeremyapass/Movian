// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetNowPlaying = (page = 1) => {
  return axios
    .get("/api/TMDB/movieList/get-now-playing", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetNowPlaying = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getNowPlaying", page],
    queryFn: () => GetNowPlaying(page),
    enabled: enable,
  });
};
