import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const GetAccountDetail = async () => {
  // 1. cek auth
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.email) return null; // belum login

  // 2. cari user di public_user berdasarkan email
  const { data, error } = await supabase
    .from("public_user")
    .select(
      "username, profile_picture, cover_picture, bio, is_favorite_public, review_count"
    )
    .eq("email", user.email)
    .single(); // asumsi email unik

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
};

export const useGetAccountDetail = () => {
  return useQuery({
    queryKey: ["account-detail"],
    queryFn: GetAccountDetail,
    staleTime: 1000 * 60 * 5,
  });
};
