import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

const GetAccountDetail = async () => {
  // 1️⃣ Ambil session (cepat)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.email) return null;

  // 2️⃣ Baru fetch data user
  const { data, error } = await supabase
    .from("public_user")
    .select(
      "username, profile_picture, cover_picture, bio, is_favorite_public, review_count, watchlist_count, favorite_count"
    )
    .eq("email", session.user.email)
    .single();

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
