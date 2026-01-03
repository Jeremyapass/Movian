import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const GetTotalFilmsFavorite = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  const { data, error } = await supabase.rpc("get_favorite_totals", {
    user_uuid: user.id,
  });

  if (error) throw error;

  return data?.[0] ?? { totalMovies: 0, totalSeries: 0 };
};

export const useGetTotalFilmsFavorite = () =>
  useQuery({
    queryKey: ["get-total-favorite", "films"],
    queryFn: () => GetTotalFilmsFavorite(),
    keepPreviousData: true,
  });
