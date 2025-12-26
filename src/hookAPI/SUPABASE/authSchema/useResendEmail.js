import { supabase } from "@/lib/supabaseClient";
import { useMutation } from "@tanstack/react-query";

const ResendEmail = async (email) => {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });

  if (error) throw error;

  return data;
};

export const useResendEmail = () => {
  return useMutation({
    mutationKey: ["ResendEmail"],
    mutationFn: ResendEmail,
  });
};
