import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const GetWatchlist = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  let query = supabase
    .from("watchlist")
    .select(
      "id, name, description, is_public, show_comments, movies_count, series_count, picture_path"
    )
    .eq("user_id", user.id);

  const { data, error } = await query;
  if (error) throw error;

  return data;
};

export const useGetWatchlist = () => {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: () => GetWatchlist(),
  });
};
