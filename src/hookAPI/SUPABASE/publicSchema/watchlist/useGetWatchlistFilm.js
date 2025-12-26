import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const GetWatchlistFilm = async (watchlistId) => {
  if (!watchlistId) return [];

  // 🔐 cek auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return [];

  // 📌 query watchlist
  const { data, error } = await supabase
    .from("watchlist_films")
    .select("tmdb_movie_id, type")
    .eq("user_id", user.id)
    .eq("watchlist_id", watchlistId);

  if (error) throw error;

  return data;
};

export const useGetWatchlistFilm = (watchlistId) => {
  return useQuery({
    queryKey: ["watchlistFilm", watchlistId],
    queryFn: () => GetWatchlistFilm(watchlistId),
    enabled: !!watchlistId, // 🔥 jangan jalan kalau id belum ada
  });
};
