import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetOnTheAirSeries = (page = 1) => {
  return axios
    .get("/api/TMDB/seriesList/get-on-the-air-series", {
      params: { page },
    })
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetOnTheAirSeries = (enable = true, page = 1) => {
  return useQuery({
    queryKey: ["getOnTheAirSeries", page],
    queryFn: () => GetOnTheAirSeries(page),
    enabled: enable,
  });
};
