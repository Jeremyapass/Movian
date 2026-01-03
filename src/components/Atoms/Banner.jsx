"use client";
import { fonts } from "@/fonts/fonts";
import React, { useState, useRef, useMemo, useEffect } from "react";
import PageButton from "./buttons/PageButton";
import AddWatchListButton from "./buttons/AddWatchListFilmButton";
import clsx from "clsx";
import gsap from "gsap";
import BannerSkeleton from "../Skeletons/BannerSkeleton";
import { usePathname, useRouter } from "next/navigation";

const Banner = ({ data }) => {
  const bannerData = useMemo(() => data?.slice(0, 6) ?? [], [data]);
  const route = useRouter();
  const currentPath = usePathname();

  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  const animating = useRef(false);
  const isHovering = useRef(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (bannerData.length > 0 && currentIndex >= bannerData.length) {
      setCurrentIndex(0);
    }
  }, [bannerData.length]);

  const animateSlide = (direction) => {
    if (animating.current || bannerData.length === 0) return;

    animating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex((prev) =>
          direction === 1
            ? (prev + 1) % bannerData.length
            : (prev - 1 + bannerData.length) % bannerData.length
        );

        requestAnimationFrame(() => {
          gsap.fromTo(
            bannerRef.current,
            { opacity: 0, x: direction === 1 ? "100%" : "-100%" },
            {
              opacity: 1,
              x: "0%",
              duration: 0.4,
              ease: "power2.inOut",
              onComplete: () => {
                animating.current = false;
              },
            }
          );
        });
      },
    });

    tl.to(bannerRef.current, {
      x: direction === 1 ? "-100%" : "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
  };

  useEffect(() => {
    if (bannerData.length === 0) return;

    const interval = setInterval(() => {
      if (!animating.current && !isHovering.current) {
        animateSlide(1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerData.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (animating.current) return;
      if (Math.abs(e.deltaX) < 40) return;

      e.preventDefault();

      if (e.deltaX > 0) {
        animateSlide(1);
      } else {
        animateSlide(-1);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;

    if (animating.current) return;
    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      animateSlide(1);
    } else {
      animateSlide(-1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    animateSlide(1);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    animateSlide(-1);
  };

  const handleIndicatorClick = (index) => {
    if (index === currentIndex || animating.current) return;

    animating.current = true;

    gsap.to(bannerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        setCurrentIndex(index);

        requestAnimationFrame(() => {
          gsap.fromTo(
            bannerRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.3,
              ease: "power2.inOut",
              onComplete: () => {
                animating.current = false;
              },
            }
          );
        });
      },
    });
  };

  const current = bannerData[currentIndex];

  if (!current) {
    return <BannerSkeleton />;
  }

  return (
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full flex flex-col gap-4 items-center justify-center overflow-hidden"
    >
      <div
        ref={bannerRef}
        className="cursor-pointer group relative px-[26px] py-[14px] h-[75vh] w-full flex flex-col justify-between rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${current.backdrop_path})`,
        }}
        onMouseEnter={() => (isHovering.current = true)}
        onMouseLeave={() => (isHovering.current = false)}
        onClick={() => {
          if (currentPath.startsWith("/movies") || currentPath === "/") {
            route.push(`/movies/movie-detail/${current.id}`);
          } else if (currentPath.startsWith("/series")) {
            route.push(`/series/series-detail/${current.id}`);
          }
        }}
      >
        <div className="flex justify-between items-center relative z-20">
          <div
            className={`bg-[linear-gradient(120deg,#FF3B6A_0%,#FF6F91_100%)]
            w-[108px] h-[44px] rounded-[8px] ${fonts.clash.className}
            font-semibold text-[20px] flex items-center justify-center`}
          >
            Trending
          </div>

          {/* <AddWatchListButton className="bg-[#2A2A2A66]" /> */}
        </div>

        <div className="absolute inset-0 z-10 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div
            className="h-full w-[15%] flex items-center pl-[26px] pointer-events-auto"
            onClick={handlePrev}
          >
            <PageButton direction="prev" className="bg-[#2A2A2A66]" />
          </div>

          <div
            className="h-full w-[15%] flex items-center justify-end pr-[26px] pointer-events-auto"
            onClick={handleNext}
          >
            <PageButton direction="next" className="bg-[#2A2A2A66]" />
          </div>
        </div>

        <div className="flex flex-col gap-2 relative z-20">
          <p className="text-[16px]">
            {current?.release_date || current?.first_air_date || "Unknown Date"}
          </p>

          <p className={`${fonts.clash.className} font-semibold text-[36px]`}>
            {current?.title || current?.name}
          </p>
        </div>
      </div>

      <div className="gap-[8px] flex">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={clsx(
              "w-[48px] h-[8px] rounded-full transition-all duration-300",
              currentIndex === index
                ? "bg-[#7B61FF]"
                : "bg-[#2F2F2F] hover:bg-[#555]"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
