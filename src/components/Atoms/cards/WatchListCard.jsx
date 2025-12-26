import React from "react";
import { fonts } from "@/fonts/fonts";
import clsx from "clsx";

const WatchListCard = ({ data }) => {
  return (
    <div className="flex flex-col gap-[11px] group cursor-pointer ">
      <div className="relative w-[270px] h-[340px] rounded-[12px] overflow-hidden">
        <div
          className={clsx(
            `absolute h-[139px] w-full rounded-[12px] `,
            data ? " " : "bg-[#2F2F2F]"
          )}
        >
          OKY
        </div>
        <div
          className={clsx(
            `absolute h-[139px] mt-[67px] w-full rounded-[12px]  z-10`,
            data ? " " : "bg-[#A1A1AA]"
          )}
        >
          OKAY2
        </div>
        <div
          className={clsx(
            `absolute h-[139px] mt-[134px]  w-full rounded-[12px] z-20`,
            data ? " " : "bg-[#2F2F2F]"
          )}
        >
          OKAY3
        </div>
        <div
          className={clsx(
            `absolute h-[139px] mt-[201px]  w-full rounded-[12px]  z-30`,
            data ? " " : "bg-[#A1A1AA]"
          )}
        >
          OKAY3
        </div>

        {/* Overlay muncul saat hover */}
        <div className="absolute inset-0 bg-transparent group-hover:bg-[#2A2A2A66]/40 transition-all z-40 duration-300" />
      </div>

      <div className="flex flex-col gap-2 transition-all duration-300 group-hover:text-[#7B61FF]">
        <h1 className={`${fonts.clash.className} font-semibold text-[24px]`}>
          Playdate {data}
        </h1>

        <p className={`${fonts.hanken.className}`}>100 films, 3 series</p>
      </div>
    </div>
  );
};
export default WatchListCard;
