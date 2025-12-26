import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const GetSearchMovie = ([query]) => {
  return axios
    .get(`${process.env.API_URL_TMDB}/search/movie`, {
      params: {
        api_key: process.env.API_KEY_TMDB,
        query: query,
        include_adult: true,
        // language : "en-US",
        // primary_release_year : new Date().getFullYear(),
        // page: 1,
        // region : "US",
        // year : new Date().getFullYear(),
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export const UseGetSearchMovie = () => {
  return useMutation({
    mutationFn: GetSearchMovie,
    mutationKey: ["getSearchMovie"],
  });
};
