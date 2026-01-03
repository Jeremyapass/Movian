import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const GetTotalWatchlist = async ({ watchlistId }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  const { data, error } = await supabase.rpc("get_watchlistfilm_totals", {
    user_uuid: user.id,
    watchlist_id: watchlistId,
  });

  if (error) throw error;

  return data?.[0] ?? { totalMovies: 0, totalSeries: 0 };
};

export const useGetTotalWatchlist = ({ watchlistId }) =>
  useQuery({
    queryKey: ["get-total-watchlist", "films", watchlistId],
    queryFn: () => GetTotalWatchlist({ watchlistId }),
    keepPreviousData: true,
  });
