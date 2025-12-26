"use client";
import { useResendEmail } from "@/hookAPI/SUPABASE/authSchema/useResendEmail";
import { fonts } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import React from "react";

const VerificationEmailPage = () => {
  const { mutate: resendEmailMutate } = useResendEmail();

  const handleClick = () => {
    resendEmailMutate(localStorage.getItem("emailUser"), {
      onSuccess: (data) => {
        console.log("Resend email success:", data);
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
      <p className={`${fonts.clash.className} text-[36px] font-semibold mb-1`}>
        Verifikasi email
      </p>
      <p className="text-[#A1A1AA] mb-6">
        Kami sudah kirim tautan verifikasi ke (alamat email){" "}
      </p>
      <div className="text-[#A1A1AA] mb-8">
        <span>Belum mendapat email? </span>
        <span
          onClick={() => handleClick()}
          className="cursor-pointer font-semibold"
        >
          Kirim ulang
        </span>
      </div>
    </div>
  );
};

export default VerificationEmailPage;
