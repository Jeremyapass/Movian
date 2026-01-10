import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetGenreIdSeries = (genreId, page) => {
  return axios
    .get("/api/TMDB/genre/get-genreId-series", {
      params: { genreId, page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetGenreIdSeries = (genreId, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["getGenreIdSeries", genreId, page],
    queryFn: () => GetGenreIdSeries(genreId, page),
    enabled: enabled && !!genreId,
  });
};
