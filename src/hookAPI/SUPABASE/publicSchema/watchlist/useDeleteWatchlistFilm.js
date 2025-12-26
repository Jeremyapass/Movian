import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

//BELUM YA. TAMBAHIN PARAMS NYA NANTI, TRUS KASIH KE GPT
const DeleteWatchlistFilm = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) return null;

  let query = supabase
    .from("favorite_movie")
    .select("tmdb_movie_id, type")
    .eq("user_id", user.id);

  const { data, error } = await query;
  if (error) throw error;

  return data;
};

export const useDeleteWatchlistFilm = () => {
  return useQuery({
    queryKey: ["delete-watchlist-film"],
    queryFn: () => DeleteWatchlistFilm(),
  });
};
