import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const GetAllWatchlistMovie = async ({ watchlistId, page }) => {
  if (!watchlistId) return [];

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return [];

  const { data, error } = await supabase
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
    .eq("watchlist_id", watchlistId)
    .eq("movie_cache.type", "movie");

  if (error) throw error;

  return data;
};

export const useGetAllWatchlistMovie = ({watchlistId, page, enabled = false} = {}) => {
  return useQuery({
    queryKey: ["get-all-watchlist-films", "movies", watchlistId, page],
    queryFn: () => GetAllWatchlistMovie({ watchlistId, page }),
    keepPreviousData: true,
    enabled, 
  });
};
