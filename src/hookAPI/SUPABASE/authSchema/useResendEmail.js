import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";

const resendEmail = async (email) => {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) throw error;

  // data hanya berisi message
  return data;
};

export const useResendEmail = () => {
  return useMutation({
    mutationKey: ["ResendEmail"],
    mutationFn: resendEmail,
  });
};
