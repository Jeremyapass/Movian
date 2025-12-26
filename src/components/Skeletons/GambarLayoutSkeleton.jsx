import React from "react";
import { fonts } from "@/fonts/fonts";

const GambarCarouselLayoutSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <div
          className={`${fonts.clash.className} h-[36px] w-[140px] bg-[#2f2f2f] rounded-md`}
        />

        <div className="flex gap-[6px]">
          <div className="w-[40px] h-[40px] rounded-full bg-[#2f2f2f]" />
          <div className="w-[40px] h-[40px] rounded-full bg-[#2f2f2f]" />
        </div>
      </div>

      {/* ===== CAROUSEL ===== */}
      <div className="flex gap-3 w-full overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-[11px] w-[270px]">
            {/* IMAGE */}
            <div className="w-[270px] h-[348px] rounded-[12px] bg-[#2f2f2f]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GambarCarouselLayoutSkeleton;
