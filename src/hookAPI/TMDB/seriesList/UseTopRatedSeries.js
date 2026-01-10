import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetTopRatedSeries = (page = 1) => {
  return axios
    .get("/api/TMDB/seriesList/get-top-rated-series", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetTopRatedSeries = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getTopRatedSeries", page],
    queryFn: () => GetTopRatedSeries(page),
    enabled: enable,
  });
};
