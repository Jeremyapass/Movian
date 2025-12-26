import React from "react";

const BannerSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4 items-center justify-center">
      <div className="px-[26px] py-[14px] h-[75vh] w-full rounded-3xl bg-[#2f2f2f] animate-pulse" />
      <div className="gap-[8px] flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[48px] h-[8px] rounded-full bg-[#3a3a3a] animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};
export default BannerSkeleton;
