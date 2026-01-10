"use client";

import PageButton from "@/components/Atoms/buttons/PageButton";
import { fonts } from "@/fonts/fonts";
import React, { useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import WatchListCard from "@/components/Atoms/cards/WatchListCard";

const WatchlistCarouselLayout = ({ title, data, isLoading }) => {
  const scrollRef = useRef(null);
  const route = useRouter();

  const hasData = data && data.length > 0;

  // ===== AMAN =====
  const getCardWidth = () => {
    const first = scrollRef.current?.children?.[0];
    if (!first) return 0;
    return 3 * (first.offsetWidth + 24);
  };

  // ===== NEXT =====
  const handleNext = () => {
    if (!scrollRef.current) return;

    const wrapper = scrollRef.current;
    const cardWidth = getCardWidth();
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    const threshold = 60;

    let target = wrapper.scrollLeft + cardWidth;

    if (wrapper.scrollLeft + threshold >= maxScroll) {
      target = 0;
    }

    gsap.to(wrapper, {
      scrollLeft: target,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  // ===== PREV =====
  const handlePrev = () => {
    if (!scrollRef.current) return;

    const wrapper = scrollRef.current;
    const cardWidth = getCardWidth();
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    const threshold = 60;

    let target = wrapper.scrollLeft - cardWidth;

    if (wrapper.scrollLeft <= threshold) {
      target = maxScroll;
    }

    gsap.to(wrapper, {
      scrollLeft: target,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  return (
    <div className="w-full flex flex-col gap-[24px]">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <p className={`${fonts.clash.className} text-3xl font-semibold`}>
          {title}
        </p>

        {!isLoading && hasData && (
          <div className="flex gap-[16px] items-center">
            <div
              className={`${fonts.clash.className} cursor-pointer inline-block transition-all duration-200 text-[24px] font-semibold leading-6 border-b-[2px] border-transparent hover:border-white`}
              onClick={() => route.push("/watchlist")}
            >
              Lihat semua
            </div>

            <div className="gap-[6px] flex items-center">
              <PageButton direction="prev" onClick={handlePrev} />
              <PageButton direction="next" onClick={handleNext} />
            </div>
          </div>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      {isLoading ? (
        <div className="flex gap-[24px] w-full overflow-x-auto no-scrollbar">
          {[...Array(6)].map((_, i) => (
            <WatchListCard key={i} isLoading={true} layout="carousel" />
          ))}
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <p
            className={`${fonts.clash.className} text-[28px] font-semibold text-gray-300`}
          >
            Watchlist masih kosong
          </p>
          <p className="text-gray-500">
            Tambahkan film atau series ke watchlist untuk melihatnya di sini
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-[24px] w-full overflow-x-auto no-scrollbar"
        >
          {data.map((item) => (
            <WatchListCard
              key={item.id}
              data={item}
              layout="carousel"
              onClick={() => route.push(`/watchlist/${item.id}`)}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistCarouselLayout;
