import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const GetAllWatchlistFilm = async ({ watchlistId, tmdbId, page }) => {
  // ⭐ Check array length juga
  if (!watchlistId || watchlistId.length === 0) return [];

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return [];

  let query = supabase
    .from("watchlist_films")
    .select(
      `
      id,
      movie_cache!inner (
        id,
        tmdb_movie_id,
        name,
        type,
        poster_path,
        date_release
      ),
      watchlist!inner (
        id,
        name,
        total_movie,
        total_series
      )
    `,
      { count: page ? "exact" : undefined }
    )
    .eq("user_id", user.id)
    .in("watchlist_id", watchlistId);

  if (tmdbId) {
    query = query.eq("movie_cache.tmdb_movie_id", tmdbId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
};

export const useGetAllWatchlistFilm = ({
  watchlistId,
  tmdbId,
  page,
  enabled = true,
}) => {
  return useQuery({
    queryKey: ["get-all-watchlist-films", "films", watchlistId, tmdbId, page],
    queryFn: () => GetAllWatchlistFilm({ watchlistId, tmdbId, page }),
    keepPreviousData: true,
    enabled,
  });
};
