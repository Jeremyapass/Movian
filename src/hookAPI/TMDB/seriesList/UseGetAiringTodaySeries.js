import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetAiringTodaySeries = (page = 1) => {
  return axios
    .get("/api/TMDB/seriesList/get-airing-today-series", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetAiringTodaySeries = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getAiringTodaySeries", page],
    queryFn: () => GetAiringTodaySeries(page),
    enabled: enable,
  });
};
