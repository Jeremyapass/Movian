// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetNowPlaying = () => {
  return axios
    .get("/api/TMDB/movieList/get-now-playing")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetNowPlaying = (enable = true) => {
  return useQuery({
    queryKey: ["getNowPlaying"],
    queryFn: GetNowPlaying,
    enabled: enable,
  });
};
