import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetOnTheAirSeries =  () => {
  return axios
    .get("/api/TMDB/seriesList/get-on-the-air-series")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetOnTheAirSeries = () => {
  return useQuery({
    queryKey: ["getOnTheAirSeries"],
    queryFn: GetOnTheAirSeries,
  });
};
