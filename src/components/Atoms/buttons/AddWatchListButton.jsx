import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Check, Plus } from "lucide-react";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const AddWatchListButton = ({ className }) => {
  const [isActive, setIsActive] = useState(false);
  const iconRef = useRef(null);
  const lengthBox = useRef(null);
  const currentPath = usePathname();
  const labelRef = useRef(null);

  const isDetailPage =
    currentPath?.includes("serie-detail") ||
    currentPath?.includes("movie-detail");

  const handleClick = (e) => {
    e.stopPropagation();
    if (isDetailPage) {
      gsap.to(lengthBox.current, {
        width: isActive ? 16 : 140,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(labelRef.current, {
        opacity: isActive ? 0 : 1,
        duration: 0.1,
        delay: isActive ? 0 : 0.15,
      });
    }

    gsap.to(iconRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.15,
      onComplete: () => {
        setIsActive((prev) => !prev);

        gsap.fromTo(
          iconRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }
        );
      },
    });
  };

  return (
    <Button
      className={clsx(
        "rounded-full text-white p-[14px] h-[44px] ",
        isActive
          ? "bg-[#7B61FF] hover:bg-[#7B61FF]/80"
          : `bg-[#2A2A2A] hover:bg-[#2F2F2F] ${className}`
      )}
      onClick={handleClick}
    >
      {isDetailPage ? (
        <div
          className="flex gap-1.5 items-center justify-center "
          ref={lengthBox}
        >
          <div className="" ref={iconRef}>
            {isActive ? <Check /> : <Plus />}
          </div>

          {isActive && (
            <span className="text-[16px]" ref={labelRef}>
              Name Watchlist
            </span>
          )}
        </div>
      ) : (
        <div ref={iconRef}>{isActive ? <Check /> : <Plus />}</div>
      )}
    </Button>
  );
};

export default AddWatchListButton;
