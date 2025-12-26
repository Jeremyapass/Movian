// /src/api/TMDB/movieList/UseGetNowPlaying.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetUpcoming =  () => {
  return axios
    .get("/api/TMDB/movieList/get-up-coming")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetUpcoming = () => {
  return useQuery({
    queryKey: ["getUpcoming"],
    queryFn: GetUpcoming,
  });
};
