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

const VARIANT_MAP = {
  0: "rateRed",
  25: "rateRed",
  50: "rateYellow",
  75: "ratePurple",
  100: "ratePurple",
};

const RateButton = ({ rateNumber, clickable = true }) => {
  const [isActive, setIsActive] = useState(false);
  const wrapperRef = useRef(null);
  const blackBoxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GSAP Animation
  useEffect(() => {
    if (!blackBoxRef.current) return;
    gsap.to(blackBoxRef.current, {
      duration: 0.2,
      opacity: isActive ? 0 : 1,
      ease: "power2.inOut",
    });
  }, [isActive]);

  const handleClick = () => {
    if (!clickable) return;
    setIsActive((prev) => !prev);
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
              handleClick();
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
