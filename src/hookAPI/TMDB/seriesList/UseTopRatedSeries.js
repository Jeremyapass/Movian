import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetTopRatedSeries = () => {
  return axios
    .get("/api/TMDB/seriesList/get-top-rated-series")
    .then((res) => res.data)
    .catch((error) => {
      // optional: log atau lempar error
      throw error;
    });
};

export const UseGetTopRatedSeries = () => {
  return useQuery({
    queryKey: ["getTopRatedSeries"],
    queryFn: GetTopRatedSeries,
  });
};
