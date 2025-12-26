import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetPopularSeries =  () => {
  return  axios
    .get("/api/TMDB/seriesList/get-popular-series")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetPopularSeries = () => {
  return useQuery({
    queryKey: ["getPopularSeries"],
    queryFn: GetPopularSeries,
  });
};
