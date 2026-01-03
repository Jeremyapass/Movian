// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetPopular =  () => {
  return axios
    .get("/api/TMDB/movieList/get-popular")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetPopular = (enable = true) => {
  return useQuery({
    queryKey: ["getPopular"],
    queryFn: GetPopular,
    enabled: enable,
  });
};
