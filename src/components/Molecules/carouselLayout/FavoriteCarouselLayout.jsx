"use client";

import PageButton from "@/components/Atoms/buttons/PageButton";
import { fonts } from "@/fonts/fonts";
import React, { useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import Card from "@/components/Atoms/cards/Card";

const FavoriteCarouselLayout = ({ title, data, isLoading }) => {
  const scrollRef = useRef(null);
  const route = useRouter();

  const getCardWidth = () => {
    const first = scrollRef.current?.children?.[0];
    if (!first) return 0;
    return 3 * (first.offsetWidth + 24);
  };

  const handleNext = () => {
    if (!scrollRef.current) return;

    const wrapper = scrollRef.current;
    const cardWidth = getCardWidth();
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

    let target = wrapper.scrollLeft + cardWidth;
    if (target >= maxScroll - 60) target = 0;

    gsap.to(wrapper, {
      scrollLeft: target,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const handlePrev = () => {
    if (!scrollRef.current) return;

    const wrapper = scrollRef.current;
    const cardWidth = getCardWidth();
    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

    let target = wrapper.scrollLeft - cardWidth;
    if (target <= 60) target = maxScroll;

    gsap.to(wrapper, {
      scrollLeft: target,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  const hasData = data?.data?.length > 0;

  return (
    <div className="w-full flex flex-col gap-[24px]">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <p className={`${fonts.clash.className} text-3xl font-semibold`}>
          {title}
        </p>

        {hasData && (
          <div className="flex gap-[16px] items-center">
            <div
              className={`${fonts.clash.className} cursor-pointer inline-block transition-all duration-200 text-[24px] font-semibold leading-6 border-b-[2px] border-transparent hover:border-white`}
              onClick={() => route.push("/favorite")}
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

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex gap-[24px] w-full overflow-x-auto no-scrollbar">
          {[...Array(6)].map((_, i) => (
            <Card key={i} isLoading />
          ))}
        </div>
      ) : !hasData ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
          <p
            className={`${fonts.clash.className} text-[28px] font-semibold text-gray-300`}
          >
            Favorit masih kosong
          </p>
          <p className="text-gray-500">
            Tambahkan film atau series ke favorit untuk melihatnya di sini
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-[24px] w-full overflow-x-auto no-scrollbar"
        >
          {data.data.map((item) => {
            const isMovie = item.movie_cache.type === "movie";

            return (
              <Card
                key={item.id}
                movieCacheId={item.movie_cache_id}
                filmName={item.movie_cache.name}
                filmReleaseDate={item.movie_cache.date_release}
                filmImages={`https://image.tmdb.org/t/p/w342${item.movie_cache.poster_path}`}
                onClick={() =>
                  route.push(
                    isMovie
                      ? `/movies/movie-detail/${item.movie_cache.tmdb_movie_id}`
                      : `/series/series-detail/${item.movie_cache.tmdb_movie_id}`
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteCarouselLayout;
