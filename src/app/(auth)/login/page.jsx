"use client";

import { Button } from "@/components/ui/button";
import { fonts } from "@/fonts/fonts";
import clsx from "clsx";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignInOAuth } from "@/hookAPI/SUPABASE/authSchema/useSignInOAuth";
import { useSignIn } from "@/hookAPI/SUPABASE/authSchema/useSignIn";
import { toast } from "react-toastify";

const SignInPage = () => {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const { mutate: signInOAuthMutate, isPending: isSignInOAuthPending } =
    useSignInOAuth();
  const { mutate: signInMutate, isLoading: isSignInLoading } = useSignIn();

  const onSubmit = (data) => {
    signInMutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          route.push("/");
        },
        onError: (error) => {
          toast.error("Email atau kata sandi salah. Silakan coba lagi.");
        }
      }
    );
  };

  return (
    <div className="w-full flex-col h-screen -mt-[134px] flex items-center justify-center">
      <p
        className={`${fonts.clash.className} text-[24px] font-semibold bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent pb-3`}
      >
        MOVIAN.
      </p>
      <p className={`${fonts.clash.className} text-[36px] font-semibold mb-2`}>
        Selamat datang
      </p>
      <div className="text-[#A1A1AA] mb-8">
        <span>Belum punya akun? </span>
        <span
          onClick={() => route.push("/signup")}
          className="cursor-pointer font-semibold"
        >
          Buat akun
        </span>
      </div>

      {/* ========== FORM ========== */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={` w-full max-w-[384px] flex flex-col mb-7 `}
      >
        {/* EMAIL */}
        <p className="mb-3">Email : </p>
        <div className="flex flex-col mb-6">
          <input
            type="email"
            placeholder="Masukkan email"
            className="w-full px-3 py-2 rounded-lg bg-[#1E1E1E] text-white outline-none border border-transparent focus:border-[#7B61FF] transition-all"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Format email tidak valid",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <p className="mb-3">Kata sandi : </p>

        <div className="flex flex-col mb-6">
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi"
              className="w-full px-3 py-2 rounded-lg bg-[#1E1E1E] text-white outline-none border border-transparent focus:border-[#7B61FF] transition-all pr-10"
              {...register("password", {
                required: "Kata sandi wajib diisi",
                minLength: {
                  value: 6,
                  message: "Minimal 6 karakter",
                },
              })}
            />

            {/* ICON MATA */}
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition"
              onClick={togglePassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="w-full bg-[#7B61FF] font-semibold text-white py-3 rounded-[8px] hover:bg-[#7B61FF]/80"
        >
          Masuk
        </Button>
      </form>
      {/* LINE SEPARATOR */}
      <div className="flex items-center  justify-center w-full max-w-[384px] text-[#A1A1AA] mb-7">
        <div className="flex-1 h-[1px] bg-[#2E2E2E]"></div>

        <span className="px-2 text-sm">Atau</span>

        <div className="flex-1 h-[1px] bg-[#2E2E2E]"></div>
      </div>

      <Button
        className="w-[384px] py-3 flex items-center gap-2 mb-5"
        onClick={() => signInOAuthMutate()}
        disabled={isSignInOAuthPending}
      >
        <Image
          src="/GoogleIcon.svg" // karena file ada di /public
          alt="Google"
          width={14}
          height={14}
        />
        Masuk dengan Google
      </Button>

      <p className="w-[384px] text-center text-sm text-[#A1A1AA] ">
        Dengan klik lanjut, kamu berarti menyetujui{" "}
        <span
          className="underline cursor-pointer"
          onClick={() => route.push("/terms-of-service")}
        >
          Terms of Service{" "}
        </span>
        dan{" "}
        <span
          className="underline cursor-pointer"
          onClick={() => route.push("/polices")}
        >
          Privacy Policy.
        </span>
      </p>
    </div>
  );
};

export default SignInPage;
