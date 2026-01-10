// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetTopRated = (page = 1) => {
  return axios
    .get("/api/TMDB/movieList/get-top-rated", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetTopRated = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getTopRated", page],
    queryFn: () => GetTopRated(page),
    enabled: enable,
  });
};
