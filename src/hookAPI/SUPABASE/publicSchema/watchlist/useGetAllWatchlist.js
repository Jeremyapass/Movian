import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const GetWatchlist = async ({ watchlistId }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  let query = supabase
    .from("watchlist")
    .select(
      "id, name, description, is_public, show_comments, picture_path, total_movie, total_series"
    )
    .eq("user_id", user.id);


  if (watchlistId) {
    const { data, error } = await query.eq("id", watchlistId).single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await query;
  if (error) throw error;

  return data;
};

export const useGetWatchlist = ({ watchlistId } = {}) => {
  return useQuery({
    queryKey: ["get-all-watchlist", watchlistId ?? "all"],
    queryFn: () => GetWatchlist({ watchlistId }),
    enabled: watchlistId === undefined || !!watchlistId,
  });
};
