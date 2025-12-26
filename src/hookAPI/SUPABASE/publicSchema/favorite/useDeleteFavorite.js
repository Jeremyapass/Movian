import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DeleteFavoriteMovies = async (tmdbMovieId) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("Not authenticated");

  // 1️⃣ ambil movie_cache_id
  const { data: movieCache, error: cacheError } = await supabase
    .from("movie_cache")
    .select("id")
    .eq("tmdb_movie_id", tmdbMovieId)
    .single();

  if (cacheError) throw cacheError;

  // 2️⃣ delete favorite
  const { error } = await supabase
    .from("favorite_films")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_cache_id", movieCache.id);

  if (error) throw error;
};

export const useDeleteFavoriteMovies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteFavoriteMovies,
    onSuccess: () => {
      queryClient.invalidateQueries(["get-favorite-movies"]);
    },
  });
};
