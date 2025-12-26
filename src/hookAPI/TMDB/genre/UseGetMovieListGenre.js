import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetMovieListGenre = () => {
  return axios
    .get("/api/TMDB/genre")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetMovieListGenre = () => {
  return useQuery({
    queryKey: ["getMovieListGenre"],
    queryFn: GetMovieListGenre,
  });
};
