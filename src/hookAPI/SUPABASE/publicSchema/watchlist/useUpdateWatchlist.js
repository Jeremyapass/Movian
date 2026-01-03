import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateWatchlist = async ({
  watchlistId,
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
  if (!user?.id) throw new Error("User not authenticated");

  // Delete old watchlist image from storage if updating picture_path
  if (picture_path !== undefined) {
    // Get current picture_path before update
    const { data: currentData } = await supabase
      .from("watchlist")
      .select("picture_path")
      .eq("id", watchlistId)
      .eq("user_id", user.id)
      .single();

    // Delete old image from storage if exists
    if (currentData?.picture_path) {
      try {
        const url = currentData.picture_path;
        const bucketName = "watchlist-image";
        const bucketPath = `/storage/v1/object/public/${bucketName}/`;

        const startIndex = url.indexOf(bucketPath);

        if (startIndex !== -1) {
          const oldFileName = url.substring(startIndex + bucketPath.length);

          await supabase.storage.from(bucketName).remove([oldFileName]);
        }
      } catch (deleteError) {
        console.error("Error deleting old watchlist image:", deleteError);
      }
    }
  }

  const { data, error } = await supabase
    .from("watchlist")
    .update({
      name: name,
      description: description,
      is_public: is_public,
      picture_path: picture_path,
    })
    .eq("id", watchlistId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-all-watchlist"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-account-detail"],
      });
    },
  });
};
