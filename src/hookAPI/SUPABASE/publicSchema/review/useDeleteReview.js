import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const DeleteReview = async ({ movieCacheId }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("Unauthorized");

  if (!movieCacheId) {
    throw new Error("movieCacheId is required");
  }

  const { error } = await supabase
    .from("reviewed_films")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_cache_id", movieCacheId);

  if (error) throw error;

  return true;
};

export default DeleteReview;

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-film-review"],
    mutationFn: DeleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries(["get-film-review"]);
    },
  });
};
