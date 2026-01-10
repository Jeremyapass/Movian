import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetPopularSeries = (page = 1) => {
  return axios
    .get("/api/TMDB/seriesList/get-popular-series", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetPopularSeries = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getPopularSeries", page],
    queryFn: () => GetPopularSeries(page),
    enabled: enable,
  });
};
