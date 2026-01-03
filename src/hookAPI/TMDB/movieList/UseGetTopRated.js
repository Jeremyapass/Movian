// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetTopRated =  () => {
  return axios
    .get("/api/TMDB/movieList/get-top-rated")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetTopRated = (enable = true) => {
  return useQuery({
    queryKey: ["getTopRated"],
    queryFn: GetTopRated,
    enabled: enable,
  });
};
