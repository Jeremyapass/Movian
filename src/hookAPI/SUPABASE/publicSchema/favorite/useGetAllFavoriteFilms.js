import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 30;

const GetAllFavoriteFilms = async ({ page }) => {
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
      { count: page ? "exact" : undefined } // 🔥 count hanya kalau paginate
    )
    .eq("user_id", user.id);

  // 🔥 PAGINATION OPTIONAL
  if (page !== undefined) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  // 🔥 MODE TANPA PAGINATION
  if (page === undefined) {
    return {
      data,
      totalItems: data?.length ?? 0,
    };
  }

  // 🔥 MODE PAGINATION
  return {
    data,
    currentPage: page,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
    totalItems: count ?? 0,
  };
};

export const useGetAllFavoriteFilms = (page, enabled = true) =>
  useQuery({
    queryKey: ["getAllFavoriteFilms", page],
    queryFn: () => GetAllFavoriteFilms({ page }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
    enabled, // 🔥
  });
