import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const GetMovieCacheId = async (tmdbMovieId) => {
  if (!tmdbMovieId) return null;

  const { data, error } = await supabase
    .from("movie_cache")
    .select("id")
    .eq("tmdb_movie_id", tmdbMovieId)
    .single();

  if (error) {
    // If movie not in cache yet, return null
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data?.id || null;
};

export const useGetMovieCacheId = (tmdbMovieId) => {
  return useQuery({
    queryKey: ["get-movie-cache-id", tmdbMovieId],
    queryFn: () => GetMovieCacheId(tmdbMovieId),
    enabled: !!tmdbMovieId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
