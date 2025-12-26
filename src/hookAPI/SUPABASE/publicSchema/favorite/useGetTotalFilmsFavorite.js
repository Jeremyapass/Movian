import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const PAGE_SIZE = 30;

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

export const useGetTotalFilmsFavorite = (page = 1) =>
  useQuery({
    queryKey: ["getTotalFilmsFavorite", page],
    queryFn: () => GetTotalFilmsFavorite({ page }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
