import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getSeriesDetails = (series_id) => {
  const isArray = Array.isArray(series_id);
  const seriesIds = isArray ? series_id : series_id ? [series_id] : [];

  if (seriesIds.length === 0) return Promise.resolve(isArray ? [] : null);

  const requests = seriesIds.map((id) =>
    axios
      .get(`/api/TMDB/series/get-series-detail/${id}`)
      .then((res) => res.data)
      .catch((err) => {
        console.error(`Failed to fetch series ${id}:`, err.message);
        return null; // atau handle error sesuai kebutuhan
      })
  );
  return Promise.all(requests).then((results) =>
    isArray ? results : results[0]
  );
};

export const useGetSeriesDetails = (series_id) => {
  return useQuery({
    queryKey: ["getSeriesDetails", series_id],
    queryFn: () => getSeriesDetails(series_id),
    enabled: !!series_id, // penting
    placeholderData: (previousData) => previousData,
  });
};
