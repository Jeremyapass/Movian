import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetSearchSeries = (query, page) => {
  return axios
    .get("/api/TMDB/search/get-search-series", {
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

export const UseGetSearchSeries = (query, page = 1, enabled = true) => {
  return useQuery({
    queryKey: ["getSearchSeries", query, page],
    queryFn: () => GetSearchSeries(query, page),
    enabled: enabled && !!query,
  });
};
