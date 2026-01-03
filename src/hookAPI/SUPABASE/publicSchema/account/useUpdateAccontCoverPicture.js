import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateAccountCoverPicture = async ({ cover_picture }) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.email) throw new Error("User not authenticated");

  // Get current cover picture before update
  const { data: currentData } = await supabase
    .from("public_user")
    .select("cover_picture")
    .eq("email", user.email)
    .single();

  // Delete old cover picture from storage if exists
  if (currentData?.cover_picture) {
    try {
      const url = currentData.cover_picture;
      const bucketName = "profile-cover-image";
      const bucketPath = `/storage/v1/object/public/${bucketName}/`;

      const startIndex = url.indexOf(bucketPath);

      if (startIndex !== -1) {
        const oldFileName = url.substring(startIndex + bucketPath.length);

        await supabase.storage.from(bucketName).remove([oldFileName]);
      }
    } catch (deleteError) {
      console.error("Error deleting old cover picture:", deleteError);
    }
  }

  // Update with new cover picture
  const { data, error } = await supabase
    .from("public_user")
    .update({ cover_picture })
    .eq("email", user.email)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const useUpdateAccountCoverPicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateAccountCoverPicture,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-account-detail"],
      });
    },
  });
};
