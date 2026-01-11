import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const GetMoviesDetails = (movies_id) => {
  const isArray = Array.isArray(movies_id);
  const movieIds = isArray ? movies_id : movies_id ? [movies_id] : [];

  if (movieIds.length === 0) return Promise.resolve(isArray ? [] : null);

  const requests = movieIds.map((id) =>
    axios
      .get(`/api/TMDB/movies/get-movies-detail/${id}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(`Failed to fetch movie ${id}:`, err.message);
        return null; // atau handle error sesuai kebutuhan
      })
  );

  return Promise.all(requests).then((results) =>
    isArray ? results : results[0]
  );
};

export const useGetMoviesDetails = (movies_id) => {
  return useQuery({
    queryKey: ["get-movies-detail", movies_id],
    queryFn: () => GetMoviesDetails(movies_id),
    enabled: !!movies_id,
    placeholderData: (previousData) => previousData,
  });
};
