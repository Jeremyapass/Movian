import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DeleteWatchlistFilm = async (items) => {
  const payload = Array.isArray(items) ? items : [items];

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("Not authenticated");

  // Ambil semua movie_cache.id sekaligus
  const tmdbIds = [...new Set(payload.map((item) => item.tmdbMovieId))];

  const { data: movieCacheData, error: cacheError } = await supabase
    .from("movie_cache")
    .select("id, tmdb_movie_id")
    .in("tmdb_movie_id", tmdbIds);

  if (cacheError) throw cacheError;

  // Mapping tmdbMovieId → movie_cache.id
  const movieCacheMap = movieCacheData.reduce((acc, movie) => {
    acc[movie.tmdb_movie_id] = movie.id;
    return acc;
  }, {});

  // Buat array id untuk delete
  const deleteQuery = payload.map((item) => ({
    user_id: user.id,
    movie_cache_id: movieCacheMap[item.tmdbMovieId],
    watchlist_id: item.watchlistId,
  }));

  // Supabase tidak bisa delete multiple rows dengan object array, jadi kita lakukan filter in sequence
  // Tapi tetap bulk-friendly: bisa digabung dengan OR
  const filter = deleteQuery.reduce((acc, cur, i) => {
    acc[
      `movie_cache_id.eq.${cur.movie_cache_id}.watchlist_id.eq.${cur.watchlist_id}`
    ] = true;
    return acc;
  }, {});

  // Alternatif sederhana: iterasi kecil (biasanya aman karena delete cepat)
  for (const d of deleteQuery) {
    const { error } = await supabase
      .from("watchlist_films")
      .delete()
      .eq("user_id", d.user_id)
      .eq("movie_cache_id", d.movie_cache_id)
      .eq("watchlist_id", d.watchlist_id);

    if (error) throw error;
  }
};

export const useDeleteWatchlistFilm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteWatchlistFilm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-watchlist-films"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["get-all-watchlist"],
      });
    },
  });
};
