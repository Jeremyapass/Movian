import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetGenreIdMovie = (genreId, page) => {
  return axios
    .get("/api/TMDB/genre/get-genreId-movies", {
      params: { genreId, page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetGenreIdMovie = (genreId, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["getGenreIdMovie", genreId, page],
    queryFn: () => GetGenreIdMovie(genreId, page),
    enabled: enabled && !!genreId,
  });
};
