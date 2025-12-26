import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";

const SignInOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000", // opsional
    },
  });

  if (error) throw error;
  
  return data;
};

export const useSignInOAuth = () => {
  return useMutation({
    mutationKey: ["SignInOAuth"],
    mutationFn: SignInOAuth,
  });
};

/*
Saat google dimintain sebuah action ada 2 permission, yaitu : 
    - auth origin = peminta action ke google
        1. Google ngecke si peminta dari sumber paling pertama 
            Contoh :    * Yang minta ke google itu BE supabase. 
                        * BE itu direquest pertama dari FE
                        * Jadi google mengecek BE dan FE (karna FE peminta pertama)
    - redirect = penerimahasil dari action 
    
*/
