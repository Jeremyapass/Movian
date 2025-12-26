import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 30;

const GetAllFavoriteSeries = async ({ page, tmdbId } = {}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  let query = supabase
    .from("favorite_films")
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
      )
    `,
      { count: page ? "exact" : undefined } // count hanya kalau paginate
    )
    .eq("user_id", user.id)
    .eq("movie_cache.type", "series");

  if (tmdbId !== undefined && tmdbId !== null) {
    query = query.eq("movie_cache.tmdb_movie_id", tmdbId);
  }

  // 🔥 Hanya range kalau page ada
  if (page !== undefined) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  // 🔥 Mode tanpa pagination
  if (page === undefined) {
    return {
      data,
      totalItems: data?.length ?? 0,
    };
  }

  // 🔥 Mode pagination
  return {
    data,
    currentPage: page,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    totalItems: count ?? 0,
  };
};

export const useGetAllFavoriteSeries = ({
  page,
  tmdbId,
  enabled = false,
} = {}) =>
  useQuery({
    queryKey: ["getAllFavoriteSeries", page, tmdbId],
    queryFn: () => GetAllFavoriteSeries({ page, tmdbId }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    enabled,
  });
