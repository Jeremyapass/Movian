import React, { useEffect, useState } from "react";
import ahay from "../../../../public/avatar-image.png";
import RateButton from "@/components/Atoms/buttons/RateButton";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fonts } from "@/fonts/fonts";
import { useGetAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useGetAccountDetail";

const UlasanFilmLayout = () => {
  const getRateVariant = (rate) => {
    if (rate < 25) return "rateRed";
    if (rate < 50) return "rateRed";
    if (rate < 75) return "rateYellow";
    return "ratePurple";
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className={`${fonts.clash.className} text-2xl font-semibold`}>
        Ulasan (120 ulasan)
      </h1>

      <div className="flex flex-col items-center justify-center gap-3">
        <p className="text-[20px]">Skor rerata pengguna </p>
        <Button
          variant={getRateVariant(75)}
          size="rateButton"
          className="w-[120px] h-[55px] text-[30px]"
        >
          {75}
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <AddReview />

        <Reviews />
      </div>
    </div>
  );
};

const AddReview = () => {
  const [isWriting, setIsWriting] = useState(false);
  const route = useRouter();
  const { data: accountDetailData, isLoading: isAccountDetailLoading } =
    useGetAccountDetail();

  // console.log("account data", accountDetailData);

  if (isAccountDetailLoading) return null;

  if (!accountDetailData) {
    return (
      <div className="flex flex-col gap-[10px]      ">
        <div className="flex gap-[10px] items-center">
          <Image
            className="cursor-pointer rounded-full"
            src={ahay}
            alt="Profile"
            width={32}
            height={32}
          />
          <span className="">
            Kamu perlu masuk atau daftar untuk memberikan ulasan.
          </span>
        </div>
        <div className="flex gap-2 ml-[40px]">
          <Button
            className={"border-[1px] border-[#2E2E2E]"}
            onClick={() => route.push("/login")}
          >
            Masuk
          </Button>
          <Button variant={"purple"} onClick={() => route.push("/signup")}>
            Daftar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] ">
      <div className="flex gap-[10px] items-center">
        <Image
          className="cursor-pointer rounded-full"
          src={ahay}
          alt="Profile"
          width={32}
          height={32}
        />
        <div className="flex gap-1">
          <RateButton rateNumber={0} />
          <RateButton rateNumber={25} />
          <RateButton rateNumber={50} />
          <RateButton rateNumber={75} />
          <RateButton rateNumber={100} />
        </div>
      </div>

      <div className="ml-[40px] flex">
        <Input
          className="flex-1 py-5 border-0 bg-[#1E1E1E]"
          placeholder="Tulis ulasan Anda..."
          onFocus={() => setIsWriting(true)}
        />
      </div>

      {isWriting && (
        <div className="flex gap-2 self-end ml-[40px]">
          <Button onClick={() => setIsWriting(false)}>Batal</Button>

          <Button variant="purple">Beri Ulasan</Button>
        </div>
      )}
    </div>
  );
};

const Reviews = () => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex gap-[10px] items-center">
        <Image
          onClick={() => route.push("/profile")}
          className=""
          src={ahay}
          alt="Profile"
          width={32}
          height={32}
        />
        Nama user
      </div>

      <div className="flex gap-[10px] ml-[40px] items-center">
        <RateButton rateNumber={75} clickable={false} />
        <p className="text-[#A1A1AA]">1 hari yang lalu </p>
      </div>

      <p className="ml-[40px] ">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facilis minima
        id et tempore, non ratione exercitationem laborum sed rerum aperiam
        dolore accusantium similique cupiditate. Labore!
      </p>
    </div>
  );
};

export default UlasanFilmLayout;
