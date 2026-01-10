import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SignIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SignIn,
    mutationKey: ["signIn"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account-detail"],
      });
    },
  });
};
