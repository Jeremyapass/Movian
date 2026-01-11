import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";

const generatePublicId = () => `wl_${nanoid(10)}`;

const AddWatchlist = async ({
  name,
  description,
  is_public,
  picture_path,
}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("User tidak terautentikasi");

  const public_id = generatePublicId();

  const { data, error } = await supabase
    .from("watchlist")
    .insert({
      user_id: user.id,
      name,
      description,
      is_public,
      picture_path,
      public_id, // ⭐ simpan di sini
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
