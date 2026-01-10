import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetSearchMovie = (query, page) => {
  return axios
    .get("/api/TMDB/search/get-search-movie", {
      params: {
        query,
        page,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export const UseGetSearchMovie = (query, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["getSearchMovie", query, page],
    queryFn: () => GetSearchMovie(query, page),
    enabled: enabled && !!query,
  });
};
