import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQuery } from "@tanstack/react-query";

const SignUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const { data: profile, error: insertError } = await supabase
    .from("public_user")
    .insert({
      id: data.user.id,
      email: data.user.email,
      username: email.split("@")[0],
    });

  if (insertError) throw insertError;

  return { authScheme: data, pbulicScheme: profile };
};

export const useSignUp = () => {
  return useMutation({
    mutationKey: ["SignUp"],
    mutationFn: SignUp,
  });
};

//ambil verificationnya dari auth.public aja. Kaau blum verif berarti jwt nya gausa dikasih ke cookies. Yang public.public_user itu untuk tampilan data aja. Biar ga verify nya double" kolom di auth dan public
