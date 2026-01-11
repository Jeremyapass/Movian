import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;

  return true;
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["SignOut"],
    mutationFn: SignOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
