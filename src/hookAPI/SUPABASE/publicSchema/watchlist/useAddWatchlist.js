import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddWatchlist = async ({ name, description, is_public, picture_path }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("watchlist")
    .insert({
      user_id: user.id,
      name: name,
      description: description,
      is_public: is_public,
      picture_path: picture_path,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const useAddWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-watchlist"],
      });
    },
  });
};
