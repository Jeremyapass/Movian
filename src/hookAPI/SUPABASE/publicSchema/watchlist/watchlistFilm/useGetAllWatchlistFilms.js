import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ITEM_PER_PAGE = 30;

export const GetAllWatchlistFilm = async ({ watchlistId, tmdbId, page }) => {
  // ⭐ Check array length juga
  if (!watchlistId || watchlistId.length === 0)
    return { data: [], totalPages: 1, totalItems: 0 };

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return { data: [], totalPages: 1, totalItems: 0 };

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

  if (page !== undefined) {
    const from = (page - 1) * ITEM_PER_PAGE;
    const to = from + ITEM_PER_PAGE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  if (page === undefined) {
    return { data, totalPages: 1, totalItems: data?.length ?? 0 };
  }

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil((count ?? 0) / ITEM_PER_PAGE),
    totalItems: count ?? 0,
  };
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
    placeholderData: (previousData) => previousData,
    enabled,
    refetchOnMount: "always",
  });
};
