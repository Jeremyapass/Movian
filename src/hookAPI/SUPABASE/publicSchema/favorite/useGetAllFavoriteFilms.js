import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ITEM_PER_PAGE = 30;

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
      { count: page ? "exact" : undefined }
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (page !== undefined) {
    const from = (page - 1) * ITEM_PER_PAGE;
    const to = from + ITEM_PER_PAGE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  if (page === undefined) {
    return {
      data,
      totalItems: data?.length ?? 0,
    };
  }

  return {
    data,
    currentPage: page,
    totalPages: Math.ceil((count ?? 0) / ITEM_PER_PAGE),
    totalItems: count ?? 0,
  };
};

export const useGetAllFavoriteFilms = ({ page, enabled = true }) =>
  useQuery({
    queryKey: ["get-all-favorite", "films", page],
    queryFn: () => GetAllFavoriteFilms({ page }),
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
    enabled,
  });
