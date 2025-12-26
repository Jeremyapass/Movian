import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddFavoriteMovies = async (params) => {
  const { tmdbMovieId, name, type, posterPath, dateRelease } = params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("Not authenticated");

  const { data: movieCache, error: cacheError } = await supabase
    .from("movie_cache")
    .upsert(
      {
        tmdb_movie_id: tmdbMovieId,
        name,
        type,
        poster_path: posterPath,
        date_release: dateRelease,
      },
      { onConflict: "tmdb_movie_id" }
    )
    .select("id")
    .single();

  if (cacheError) throw cacheError;

  const { error: favError } = await supabase.from("favorite_films").insert({
    user_id: user.id,
    movie_cache_id: movieCache.id,
    type : type,
  });

  if (favError && favError.code !== "23505") throw favError;
};

export const useAddFavoriteMovies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddFavoriteMovies,
    onSuccess: () => {
      queryClient.invalidateQueries(["get-favorite-movies"]);
    },
  });
};
