import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetAiringTodaySeries =  () => {
  return axios
    .get("/api/TMDB/seriesList/get-airing-today-series")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetAiringTodaySeries = (enable = true) => {
  return useQuery({
    queryKey: ["getAiringTodaySeries"],
    queryFn: GetAiringTodaySeries,
    enabled: enable,
  });
};
