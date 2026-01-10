import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetSeriesListGenre = () => {
  return axios
    .get("/api/TMDB/genre/get-genre-series")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetSeriesListGenre = () => {
  return useQuery({
    queryKey: ["getSeriesListGenre"],
    queryFn: GetSeriesListGenre,
  });
};
