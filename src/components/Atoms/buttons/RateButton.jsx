import { Button } from "@/components/ui/button";
import clsx from "clsx";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";

const GRADIENT_MAP = {
  0: "bg-[linear-gradient(120deg,#DC2626_0%,#FF6F91_100%)]",
  25: "bg-[linear-gradient(120deg,#DC2626_0%,#FF6F91_100%)]",
  50: "bg-[linear-gradient(120deg,#D5AE39_0%,#FF6F91_100%)]",
  75: "bg-[linear-gradient(120deg,#7B61FF_0%,#FF6F91_100%)]",
  100: "bg-[linear-gradient(120deg,#7B61FF_0%,#FF6F91_100%)]",
};

const VARIANT_MAP = Array.from({ length: 101 }, (_, i) => {
  if (i >= 0 && i <= 24) return "rateRed";
  if (i >= 25 && i <= 49) return "rateRed";
  if (i >= 50 && i <= 74) return "rateYellow";
  if (i >= 75 && i <= 100) return "ratePurple";
}).reduce((acc, variant, index) => {
  acc[index] = variant;
  return acc;
}, {});

const RateButton = ({
  rateNumber,
  clickable = true,
  onClick,
  isActive = false,
}) => {
  const wrapperRef = useRef(null);
  const blackBoxRef = useRef(null);

  // GSAP Animation
  useEffect(() => {
    if (!blackBoxRef.current) return;
    gsap.to(blackBoxRef.current, {
      duration: 0.2,
      opacity: isActive ? 0 : 1,
      ease: "power2.inOut",
    });
  }, [isActive]);

  const handleClick = (e) => {
    if (!clickable) return;
    if (onClick) {
      onClick(e);
    }
  };

  // ❌ Jika tidak clickable → tampilkan tombol saja
  if (!clickable) {
    return (
      <Button
        variant={VARIANT_MAP[rateNumber]}
        size="rateButton"
        className="z-30"
      >
        {rateNumber}
      </Button>
    );
  }

  // ✔ Jika clickable → tampilkan tombol dengan animasi
  return (
    <div ref={wrapperRef} className="w-[61px]">
      <div
        className={clsx(
          "p-[2px] rounded-full relative flex items-center justify-center z-0",
          GRADIENT_MAP[rateNumber]
        )}
      >
        <div
          ref={blackBoxRef}
          className="absolute w-[calc(100%+2px)] h-[calc(100%+1px)] rounded-full z-10 bg-[#0D0D0D]"
        />

        <div className="bg-[#0D0D0D] p-[4px] rounded-full flex items-center justify-center z-20">
          <Button
            variant={VARIANT_MAP[rateNumber]}
            size="rateButton"
            className="z-30"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}
          >
            {rateNumber}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RateButton;
