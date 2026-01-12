"use client";

import { fonts } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Client-only page
const VerificationSuccessPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("checking"); // checking | success | error
  const [message, setMessage] = useState("Memproses verifikasi...");

  // Supabase client dibuat sekali di client
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  useEffect(() => {
    // Pastikan ini dijalankan hanya di client
    const params = new URLSearchParams(window.location.search);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const storedEmail = localStorage.getItem("emailUser");

    if (storedEmail) setEmail(storedEmail);

    if (!access_token || !refresh_token) {
      setStatus("error");
      setMessage("Token tidak ditemukan atau tidak valid");
      setTimeout(() => router.replace("/signup"), 2000);
      return;
    }

    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(({ data, error }) => {
        if (error || !data.session) {
          setStatus("error");
          setMessage("Token tidak valid atau sudah kadaluarsa");
          setTimeout(() => router.replace("/login"), 5000);
        } else {
          setStatus("success");
          setMessage("Email berhasil diverifikasi! Silakan login ulang...");
          setTimeout(() => router.replace("/login"), 2000);
        }
      });
  }, [supabase, router]);

  return (
    <div className="w-full flex flex-col h-screen -mt-[134px] items-center justify-center">
      <p
        className={`${fonts.clash.className} text-[24px] font-semibold bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent pb-3`}
      >
        MOVIAN.
      </p>

      <p
        className={`${fonts.clash.className} text-[36px] font-semibold mb-1 ${
          status === "success"
            ? "text-green-400"
            : status === "error"
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {status === "success"
          ? "Verifikasi Berhasil"
          : status === "error"
          ? "Verifikasi Gagal"
          : "Sedang Verifikasi"}
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
