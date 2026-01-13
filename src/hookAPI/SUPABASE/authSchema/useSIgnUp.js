import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";

const SignUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;

  // Username akan di-generate di server-side (/auth/callback) setelah email terverifikasi
  return {
    authScheme: data,
  };
};

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["SignUp"],
    mutationFn: SignUp,
  });
};
