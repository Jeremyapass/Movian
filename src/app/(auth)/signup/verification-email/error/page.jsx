"use client";
import { useResendEmail } from "@/hookAPI/SUPABASE/authSchema/useResendEmail";
import { fonts } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const VerificationErrorPage = () => {
  const router = useRouter();
  const { mutate: resendEmailMutate } = useResendEmail();
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("emailUser");
    if (!storedEmail) {
      router.push("/signup");
    } else {
      setEmail(storedEmail);
      // ⏱️ optional: langsung set cooldown awal
      setCountdown(15);
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleClick = () => {
    if (countdown > 0) {
      toast.warning(`Tunggu ${countdown} detik sebelum kirim ulang.`);
      return;
    }

    if (!email) {
      toast.error("Email tidak ditemukan. Silakan daftar ulang.");
      router.push("/signup");
      return;
    }

    // ⏱️ reset cooldown ke 15 detik
    setCountdown(15);

    resendEmailMutate(email, {
      onSuccess: () => {
        toast.success("Tautan verifikasi telah dikirim ulang ke email kamu.");
      },
      onError: (error) => {
        console.error("Resend email error:", error);
        toast.error("Gagal mengirim ulang email. Silakan coba lagi.");
        setCountdown(0);
      },
    });
  };

  return (
    <div className="w-full flex-col h-screen -mt-[134px] flex items-center justify-center">
      <p
        className={`${fonts.clash.className} text-[24px] font-semibold bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent pb-3`}
      >
        MOVIAN.
      </p>

      <p
        className={`${fonts.clash.className} text-[36px] font-semibold mb-1 text-red-400`}
      >
        Gagal verifikasi email
      </p>

      <p className="text-[#A1A1AA] mb-6 text-center max-w-md">
        Tautan verifikasi mungkin sudah kedaluwarsa atau tidak valid.
        {email && (
          <>
            <br />
            Email: <span className="text-white">{email}</span>
          </>
        )}
      </p>

      <div className="text-[#A1A1AA] mb-8">
        <span>Belum mendapat email? </span>
        <span
          onClick={handleClick}
          className={`cursor-pointer font-semibold ${
            countdown > 0 ? "opacity-50 cursor-not-allowed" : "hover:text-white"
          }`}
        >
          Kirim ulang{countdown > 0 && ` (${countdown}s)`}
        </span>
      </div>
    </div>
  );
};

export default VerificationErrorPage;
