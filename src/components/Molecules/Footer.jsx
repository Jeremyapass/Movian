"use client";

import React from "react";
import { Button } from "../ui/button";
import { fonts } from "@/fonts/fonts";
import { ChevronUp } from "lucide-react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const Footer = () => {
  const currentPath = usePathname();

  const handleScrollToTop = () => {
    gsap.to(
      { value: window.scrollY },
      {
        duration: 1,
        value: 0,
        ease: "power3.out",
        onUpdate: function () {
          window.scrollTo(0, this.targets()[0].value);
        },
      }
    );
  };

  // Kondisi: hide footer
  if (currentPath.includes("/login") || currentPath.includes("/signup")) {
    return null;
  }

  return (
    <div className="flex flex-col px-6 py-10 w-full mb-[5vh] mt-[88px] bg-[#1A1A1A] rounded-2xl">
      <div className="flex justify-between items-center mb-[38px]">
        <p
          className={`bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent ${fonts.clash.className} text-[24px] font-bold`}
        >
          MOVIAN.
        </p>

        <Button
          onClick={handleScrollToTop}
          className="bg-[#2A2A2A] hover:bg-[#2F2F2F] text-white rounded-full p-4 flex items-center justify-center"
        >
          <ChevronUp />
        </Button>
      </div>

      <p className="mb-[16px] w-[504px]">
        Movian adalah ruang kecil untuk menulis, berbagi, dan mengenal film
        lebih dekat. Streaming tetap di platform resmi, diskusinya bisa di sini.
      </p>

      <div className="w-full h-[2px] bg-[#2E2E2E] rounded-full mb-[16px]" />

      <p className="mb-[10px]">
        © 2025 Movian. Designed for film enthusiasts, powered by passion.
      </p>

      <div className="self-end flex items-center justify-center gap-2.5">
        <Button className="text-[#A1A1AA]">Tentang</Button>
        <Button className="text-[#A1A1AA]">Kontak</Button>
        <Button className="text-[#A1A1AA]">Peraturan layanan & privasi</Button>
      </div>
    </div>
  );
};

export default Footer;
