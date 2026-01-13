import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ITEM_PER_PAGE = 30;

export const GetPublicWatchlistFilm = async ({ publicId, tmdbId, page }) => {
  if (!publicId)
    return { data: [], totalPages: 1, totalItems: 0, watchlistInfo: null };

  // First, get the watchlist by public_id
  const { data: watchlistData, error: watchlistError } = await supabase
    .from("watchlist")
    .select(
      "id, name, public_id, is_public, total_movie, total_series, description"
    )
    .eq("public_id", publicId)
    .eq("is_public", true)
    .maybeSingle();

  if (watchlistError) throw watchlistError;

  if (!watchlistData) {
    throw new Error("Watchlist tidak ditemukan atau tidak publik");
  }

  // Then get the films for this watchlist
  let query = supabase
    .from("watchlist_films")
    .select(
      `
      id,
      movie_cache_id,
      movie_cache!inner (
        id,
        tmdb_movie_id,
        name,
        type,
        poster_path,
        date_release
      )
    `,
      { count: page ? "exact" : undefined }
    )
    .eq("watchlist_id", watchlistData.id);

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

  // Attach watchlist info to each film item
  const dataWithWatchlist = (data || []).map((item) => ({
    ...item,
    watchlist: watchlistData,
  }));

  return {
    data: dataWithWatchlist,
    currentPage: page,
    totalPages: Math.ceil((count ?? 0) / ITEM_PER_PAGE),
    totalItems: count ?? dataWithWatchlist.length,
    watchlistInfo: watchlistData,
  };
};

export const useGetPublicWatchlistFilm = ({
  publicId,
  tmdbId,
  page,
  enabled = true,
}) => {
  return useQuery({
    queryKey: ["get-public-watchlist-films", publicId, tmdbId, page],
    queryFn: () => GetPublicWatchlistFilm({ publicId, tmdbId, page }),
    enabled: enabled && !!publicId,
    staleTime: 30000,
    retry: 0, // Don't retry on error (for private watchlist)
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
};
