import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 30;

const GetWatchlist = async ({ watchlistId, page = 1 }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  let query = supabase
    .from("watchlist")
    .select(
      "id, name, description, is_public, show_comments, picture_path, total_movie, total_series, created_at, updated_at, public_id",
      { count: "exact" }
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (watchlistId) {
    const { data, error } = await query.eq("id", watchlistId).single();
    if (error) throw error;
    return { data, count: 1 };
  }

  // Add pagination
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    data,
    count,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
  };
};

export const useGetWatchlist = ({ watchlistId, page = 1 } = {}) => {
  return useQuery({
    queryKey: ["get-all-watchlist", watchlistId ?? "all", page],
    queryFn: () => GetWatchlist({ watchlistId, page }),
    enabled: watchlistId === undefined || !!watchlistId,
    placeholderData: (previousData) => previousData,
    refetchOnMount: "always",
  });
};
