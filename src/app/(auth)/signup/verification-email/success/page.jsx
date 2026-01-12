"use client";
import { fonts } from "@/fonts/fonts";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const VerificationSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Memproses verifikasi...");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailUser");
    if (storedEmail) setEmail(storedEmail);

    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ data, error }) => {
          if (error || !data.session) {
            setStatus("error");
            setMessage("Token tidak valid atau sudah expired");
            setTimeout(() => router.push("/login"), 5000);
          } else {
            setStatus("success");
            setMessage("Email berhasil diverifikasi! Silahkan login ulang...");
            setTimeout(() => router.push("/login"), 5000);
          }
        });
    } else {
      setStatus("error");
      setMessage("Token tidak ditemukan");
      setTimeout(() => router.push("/"), 2000);
    }
  }, [searchParams, supabase, router]);

  return (
    <div className="w-full flex-col h-screen -mt-[134px] flex items-center justify-center">
      <p
        className={`${fonts.clash.className} text-[24px] font-semibold bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent pb-3`}
      >
        MOVIAN.
      </p>

      <p
        className={`${fonts.clash.className} text-[36px] font-semibold mb-1 ${
          status === "success" ? "text-green-400" : "text-white"
        }`}
      >
        {status === "success" ? "Verifikasi Berhasil" : "Sedang Verifikasi"}
      </p>

      <p className="text-[#A1A1AA] mb-6 text-center max-w-md">
        {message}
        {email && (
          <>
            <br />
            Email: <span className="text-white">{email}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default VerificationSuccessPage;
