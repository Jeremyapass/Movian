import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const UpdateAccountDetail = async ({
  username,
  bio,
  profile_picture,
  is_favorite_public,
}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.email) throw new Error("User not authenticated");

  // Delete old profile picture from storage if updating profile_picture
  if (profile_picture !== undefined) {
    // Get current profile picture before update
    const { data: currentData } = await supabase
      .from("public_user")
      .select("profile_picture")
      .eq("email", user.email)
      .single();

    // Delete old profile picture from storage if exists
    if (currentData?.profile_picture) {
      try {
        const url = currentData.profile_picture;
        const bucketName = "profile-image";
        const bucketPath = `/storage/v1/object/public/${bucketName}/`;

        const startIndex = url.indexOf(bucketPath);

        if (startIndex !== -1) {
          const oldFileName = url.substring(startIndex + bucketPath.length);

          await supabase.storage.from(bucketName).remove([oldFileName]);
        }
      } catch (deleteError) {
        console.log("Error deleting old profile picture:", deleteError);
      }
    }
  }

  // Build update object only with provided fields
  const updateData = {};
  if (username !== undefined) updateData.username = username;
  if (bio !== undefined) updateData.bio = bio;
  if (profile_picture !== undefined)
    updateData.profile_picture = profile_picture;
  if (is_favorite_public !== undefined)
    updateData.is_favorite_public = is_favorite_public;

  const { data, error } = await supabase
    .from("public_user")
    .update(updateData)
    .eq("email", user.email)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const useUpdateAccountDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UpdateAccountDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-account-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-film-review"],
      });
    },
  });
};
