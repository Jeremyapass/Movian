// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetUpcoming = (page = 1) => {
  return axios
    .get("/api/TMDB/movieList/get-up-coming", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetUpcoming = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getUpcoming", page],
    queryFn: () => GetUpcoming(page),
    enabled: enable,
  });
};
