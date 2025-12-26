"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

import PageButton from "@/components/Atoms/buttons/PageButton";
import { fonts } from "@/fonts/fonts";
import GambarCarouselLayoutSkeleton from "@/components/Skeletons/GambarLayoutSkeleton";
import { X } from "lucide-react";

const GambarCarouselLayout = ({ data, isLoading }) => {
  const scrollRef = useRef(null);
  const [activeImage, setActiveImage] = useState(null);

  // ===== LOCK BODY SCROLL (AMAN) =====
  useEffect(() => {
    if (activeImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeImage]);

  // ===== SCROLL HELPERS =====
  const getCardWidth = () => {
    const first = scrollRef.current?.children[0];
    if (!first) return 0;
    return 3 * (first.offsetWidth + 12);
  };

  const handleNext = () => {
    const wrapper = scrollRef.current;
    if (!wrapper) return;

    gsap.to(wrapper, {
      scrollLeft: wrapper.scrollLeft + getCardWidth(),
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handlePrev = () => {
    const wrapper = scrollRef.current;
    if (!wrapper) return;

    gsap.to(wrapper, {
      scrollLeft: wrapper.scrollLeft - getCardWidth(),
      duration: 0.35,
      ease: "power2.out",
    });
  };

  if (isLoading) return <GambarCarouselLayoutSkeleton />;
  if (!data?.length) return null;

  return (
    <>
      {/* ===== MAIN ===== */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <p className={`${fonts.clash.className} text-3xl font-semibold`}>
            Gambar
          </p>

          <div className="flex gap-2">
            <PageButton direction="prev" onClick={handlePrev} />
            <PageButton direction="next" onClick={handleNext} />
          </div>
        </div>

        {/* ===== CAROUSEL ===== */}
        <div
          ref={scrollRef}
          className="flex gap-3 w-full overflow-x-auto no-scrollbar"
        >
          {data.map((poster, index) => (
            <div
              key={index}
              className="w-[270px] shrink-0 cursor-pointer"
              onClick={() =>
                setActiveImage(
                  `https://image.tmdb.org/t/p/original${poster.file_path}`
                )
              }
            >
              <div className="relative w-[270px] h-[348px] rounded-2xl overflow-hidden">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
                  alt="Poster"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 270px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== FULLSCREEN MODAL (CUSTOM) ===== */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={() => setActiveImage(null)}
          >
            <Image
              src={activeImage}
              alt="Preview Fullscreen"
              fill
              priority
              className="object-contain"
            />

            {/* CLOSE */}
            <button
              className="absolute top-4 right-4 text-white text-3xl cursor-pointer"
              onClick={() => setActiveImage(null)}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GambarCarouselLayout;
