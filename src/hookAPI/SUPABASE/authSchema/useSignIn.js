import { supabase } from "@/lib/supabaseClient";
import axiosInstance from "../../axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

const SignIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: SignIn,
    mutationKey: ["signIn"],
  });
};
