"use client";
import { useSignUp } from "@/hookAPI/SUPABASE/authSchema/useSIgnUp";
import { Button } from "@/components/ui/button";
import { fonts } from "@/fonts/fonts";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const { mutate: signUpMutate } = useSignUp();

  const onSubmit = (data) => {
    // Kirim hanya email & password ke API
    signUpMutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          localStorage.setItem("emailUser", data.email);
          router.push("/signup/verification-email");
        },
        onError: (error) => {
          toast.error("Email sudah terdaftar. Silakan gunakan email lain.");
        },
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
        Buat akun
      </p>

      <div className="text-[#A1A1AA] mb-8">
        <span>Sudah punya akun? </span>
        <span
          onClick={() => router.push("/login")}
          className="cursor-pointer font-semibold"
        >
          Masuk
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[384px] flex flex-col mb-7"
      >
        {/* EMAIL */}
        <p className="mb-3">Email :</p>
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
        <p className="mb-3">Kata sandi :</p>
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

        {/* KONFIRMASI PASSWORD */}
        <p className="mb-3">Konfirmasi kata sandi :</p>
        <div className="flex flex-col mb-6">
          <div className="relative w-full ">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Ulangi kata sandi"
              className="w-full px-3 py-2 rounded-lg bg-[#1E1E1E] text-white outline-none border border-transparent focus:border-[#7B61FF] transition-all pr-10"
              {...register("confirmPassword", {
                required: "Konfirmasi wajib diisi",
                validate: (value) =>
                  value === getValues("password") || "Kata sandi tidak sama",
              })}
            />

            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white transition"
              onClick={togglePassword}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="w-full bg-[#7B61FF] font-semibold text-white py-3 rounded-[8px] hover:bg-[#7B61FF]/80"
        >
          Buat Akun
        </Button>
      </form>
    </div>
  );
};

export default SignUpPage;
