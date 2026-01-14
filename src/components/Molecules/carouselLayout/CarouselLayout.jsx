import PageButton from "@/components/Atoms/buttons/PageButton";
import { fonts } from "@/fonts/fonts";
import React, { useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import Card from "@/components/Atoms/cards/Card";

const CarouselLayout = ({
  title,
  subtitle,
  data,
  onViewAllClick,
  isLoading,
  type,
}) => {
  const scrollRef = useRef(null);
  const route = useRouter();

  const mediaConfig = {
    movie: {
      name: (d) => d.title,
      date: (d) => d.release_date,
      path: (id) => `/movies/movie-detail/${id}`,
    },
    series: {
      name: (d) => d.name,
      date: (d) => d.first_air_date,
      path: (id) => `/series/series-detail/${id}`,
    },
  };
  const config = mediaConfig[type];
  // Mendapatkan width card + gap
  const getCardWidth = () => {
    const first = scrollRef.current.children[0];
    return 3 * (first.offsetWidth + 24); // width + gap
  };

  // NEXT
  const handleNext = () => {
    const wrapper = scrollRef.current;
    const cardWidth = getCardWidth();

    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    const threshold = 60;

    let target = wrapper.scrollLeft + cardWidth;

    // Jika sudah sangat dekat ujung → reset ke awal
    if (wrapper.scrollLeft + threshold >= maxScroll) {
      target = 0;
    }

    gsap.to(wrapper, {
      scrollLeft: target,
      duration: 0.35,
      ease: "power2.out",
    });
  };

  // PREV
  const handlePrev = () => {
    const wrapper = scrollRef.current;
    const cardWidth = getCardWidth();

    const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    const threshold = 60;

    let target = wrapper.scrollLeft - cardWidth;

    // Jika sudah sangat dekat dengan awal → lompat ke akhir
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
      <div className="flex justify-between items-center">
        <div>
          <p className={`${fonts.clash.className} text-3xl font-semibold`}>
            {title}
          </p>
          <p className="text-[18px]">{subtitle}</p>
        </div>

        <div className="flex gap-[16px] items-center">
          <div
            className={`${fonts.clash.className} cursor-pointer inline-block transition-all duration-200 text-[24px] font-semibold leading-6 border-b-[2px] border-transparent hover:border-white`}
            onClick={onViewAllClick}
          >
            Lihat semua
          </div>

          <div className="gap-[6px] flex items-center">
            <PageButton direction="prev" onClick={handlePrev} />
            <PageButton direction="next" onClick={handleNext} />
          </div>
        </div>
      </div>

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex gap-[24px] w-full overflow-x-auto no-scrollbar"
      >
        {isLoading
          ? [...Array(6)].map((_, i) => <Card key={i} isLoading={true} />)
          : data?.map((data, index) => (
              <Card
                key={index}
                filmName={config.name(data)}
                filmReleaseDate={config.date(data)}
                filmImages={`https://image.tmdb.org/t/p/w342${data.poster_path}`}
                type={type}
                onClick={() => route.push(config.path(data.id))}
              />
            ))}
      </div>
    </div>
  );
};

export default CarouselLayout;
