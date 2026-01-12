import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";

const generateMVNUsername = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";

  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `user-MVN-${random}`;
};

const generateUniqueUsername = async () => {
  let username;
  let exists = true;

  while (exists) {
    username = generateMVNUsername();

    const { data, error } = await supabase
      .from("public_user")
      .select("username")
      .eq("username", username)
      .single();

    if (error && error.code === "PGRST116") {
      exists = false;
    } else if (!error && data) {
      exists = true;
    } else if (error) {
      throw error;
    }
  }

  return username;
};

const SignUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;

  const username = await generateUniqueUsername();

  const { data: profile, error: insertError } = await supabase
    .from("public_user")
    .insert({
      id: data.user.id,
      email: data.user.email,
      username,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  return {
    authScheme: data,
    publicScheme: profile,
  };
};

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["SignUp"],
    mutationFn: SignUp,
  });
};
