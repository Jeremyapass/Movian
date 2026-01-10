import React from "react";
import clsx from "clsx";

const CardSkeleton = ({ layout }) => {
  const isLayoutFull = layout === "layoutfull";

  return (
    <div
      className={clsx(
        "flex flex-col gap-[11px] animate-pulse",
        isLayoutFull ? "w-full" : "w-[270px]"
      )}
    >
      {/* Image Skeleton */}
      <div
        className={clsx(
          "relative rounded-[12px] overflow-hidden bg-[#2f2f2f]",
          isLayoutFull ? "w-full aspect-[27/38]" : "w-[270px] h-[380px]"
        )}
      />

      {/* Text Section */}
      <div className="flex flex-col min-h-[120px] gap-3">
        <div className="h-[28px] w-full max-w-[200px] rounded-md bg-[#2f2f2f]" />
        <div className="h-[18px] w-full max-w-[120px] rounded-md bg-[#2f2f2f]" />
      </div>
    </div>
  );
};

export default CardSkeleton;
