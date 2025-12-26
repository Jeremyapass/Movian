import React from "react";

const NavbarSkeleton = () => {
  return (
    <div className="fixed backdrop-blur-[2px] top-0 z-50 bg-[rgba(13,13,13,0.10)] rounded-b-[24px] text-white flex justify-center items-center gap-3 p-[24px]">
      {/* Left group (logo + navigation) */}
      <div className="flex items-center justify-center pl-[24px] pr-[8px] py-[8px] bg-[#1A1A1A] rounded-[16px] gap-[28px]">
        {/* Logo skeleton */}
        <div className="w-[60px] h-[28px] bg-gray-700 rounded-md animate-pulse"></div>

        {/* Navigation buttons skeleton */}
        <div className="gap-[8px] flex items-center justify-center">
          <div className="w-[60px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>
          <div className="w-[60px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>
          <div className="w-[60px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>
          <div className="w-[60px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>

          {/* Search skeleton */}
          <div className="w-[160px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Right group (login/signup OR user buttons) */}
      <div className="flex items-center justify-center gap-4 bg-[#1A1A1A] px-4 py-[12px] rounded-[16px]">
        <div className="w-[80px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>
        <div className="w-[80px] h-[36px] bg-gray-700 rounded-md animate-pulse"></div>
      </div>
    </div>
  );
};

export default NavbarSkeleton;
