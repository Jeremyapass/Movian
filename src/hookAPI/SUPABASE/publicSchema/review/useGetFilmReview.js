import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const GetFilmReview = async ({ movieId }) => {
  if (!movieId) return [];

  const { data, error } = await supabase
    .from("reviewed_films")
    .select(
      `
      movie_cache_id,
      comment,
      rating,
      created_at,
      user_id,
      public_user (
        username
      )
    `
    )
    .eq("movie_cache_id", movieId);

  if (error) throw error;

  return data ?? [];
};

export default GetFilmReview;

export const useGetFilmReview = (movieId) => {
  return useQuery({
    queryKey: ["get-film-review", movieId],
    queryFn: () => GetFilmReview({ movieId }),
    enabled: !!movieId,
  });
};
