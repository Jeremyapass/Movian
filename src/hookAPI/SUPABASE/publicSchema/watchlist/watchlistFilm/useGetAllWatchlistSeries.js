import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ITEM_PER_PAGE = 30;

export const GetAllWatchlistSeries = async ({ watchlistId, page }) => {
  if (!watchlistId) return { data: [], totalPages: 1, totalItems: 0 };

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
    .eq("watchlist_id", watchlistId)
    .eq("movie_cache.type", "series");

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

export const useGetAllWatchlistSeries = ({
  watchlistId,
  page,
  enabled = false,
} = {}) => {
  return useQuery({
    queryKey: ["get-all-watchlist-films", "series", watchlistId, page],
    queryFn: () => GetAllWatchlistSeries({ watchlistId, page }),
    keepPreviousData: true,
    enabled,
    refetchOnMount: "always",
  });
};
