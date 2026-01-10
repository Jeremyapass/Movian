import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddWatchlistFilm = async (params) => {
  const items = Array.isArray(params) ? params : [params];

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("Not authenticated");

  // 1️⃣ Hapus duplicate payload berdasarkan tmdbMovieId
  const uniqueItems = Array.from(
    new Map(items.map((item) => [item.tmdbMovieId, item])).values()
  );

  // 2️⃣ Bulk upsert ke movie_cache
  const { data: movieCacheData, error: cacheError } = await supabase
    .from("movie_cache")
    .upsert(
      uniqueItems.map((item) => ({
        tmdb_movie_id: item.tmdbMovieId,
        name: item.name,
        type: item.type,
        poster_path: item.posterPath,
        date_release: item.dateRelease,
      })),
      { onConflict: "tmdb_movie_id", returning: "representation" }
    )
    .select("id, tmdb_movie_id");

  if (cacheError) throw cacheError;

  // 3️⃣ Mapping tmdb_movie_id → movie_cache.id
  const movieCacheMap = movieCacheData.reduce((acc, movie) => {
    acc[movie.tmdb_movie_id] = movie.id;
    return acc;
  }, {});

  // 4️⃣ Bulk insert ke watchlist_films
  const watchlistInsert = items.map((item) => ({
    user_id: user.id,
    movie_cache_id: movieCacheMap[item.tmdbMovieId],
    type: item.type,
    watchlist_id: item.watchlistId,
  }));

  const { error: watchlistError } = await supabase
    .from("watchlist_films")
    .insert(watchlistInsert, {
      onConflict: ["user_id", "movie_cache_id", "watchlist_id"], // skip duplicate
    });

  if (watchlistError && watchlistError.code !== "23505") {
    throw watchlistError;
  }
};

export const useAddWatchlistFilm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddWatchlistFilm,
    onSuccess: () => {
      // Invalidate semua watchlist queries untuk update data
      queryClient.invalidateQueries({
        queryKey: ["get-all-watchlist-films"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-watchlist"],
        exact: false,
      });
    },
  });
};
