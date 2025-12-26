import PageButton from "@/components/Atoms/buttons/PageButton";
import { fonts } from "@/fonts/fonts";
import Image from "next/image";
import React, { useRef } from "react";
import gsap from "gsap";
import PemeranCarouselLayoutSkeleton from "@/components/Skeletons/PemeranLayoutSkeleton";

const PemeranCarouselLayout = ({ data, isLoading }) => {
  const scrollRef = useRef(null);

  // sama pola dengan CarouselLayout
  const getCardWidth = () => {
    const first = scrollRef.current?.children[0];
    if (!first) return 0;
    return 3 * (first.offsetWidth + 4); // gap-1 = 4px
  };

  const handleNext = () => {
    const wrapper = scrollRef.current;
    if (!wrapper) return;

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

  const handlePrev = () => {
    const wrapper = scrollRef.current;
    if (!wrapper) return;

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

  if (isLoading) {
    return <PemeranCarouselLayoutSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2 w-full ">
      <div className="flex justify-between items-center">
        <p className={`${fonts.clash.className} text-3xl font-semibold`}>
          Pemeran
        </p>

        <div className="flex gap-[16px] items-center">
          <div className="gap-[6px] flex items-center">
            <PageButton direction="prev" onClick={handlePrev} />
            <PageButton direction="next" onClick={handleNext} />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 w-full overflow-x-auto no-scrollbar "
      >
        {data?.map((person, index) => (
          <div
            key={index}
            className="flex flex-col gap-[11px]  group cursor-pointer w-fit"
            onClick={() =>
              window.open(
                `https://en.wikipedia.org/wiki/${person.name.replace(
                  / /g,
                  "_"
                )}`,
                "_blank"
              )
            }
          >
            <div className="relative flex items-center justify-center w-[196px] h-[292px] rounded-[12px]">
              {person.profile_path === null ? (
                <div
                  className={`w-full h-full rounded-2xl flex items-center justify-center bg-[#0D0D0D] ${fonts.clash.className} font-semibold text-[45px]`}
                >
                  <span className="bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent">
                    MVN.
                  </span>
                </div>
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt="PemeranImage"
                  width={196}
                  height={292}
                  className="object-cover transition-all duration-300 w-full h-full rounded-2xl"
                  loading="lazy"
                />
              )}

              <div className="absolute inset-0 bg-transparent rounded-2xl group-hover:bg-[#2A2A2A66]/40 transition-all duration-300" />
            </div>

            <div className="flex flex-col transition-all duration-300 group-hover:text-[#7B61FF]">
              <h1 className="font-semibold text-[20px] line-clamp-1">
                {person.name}
              </h1>
              <p className="text-base line-clamp-1">{person.character}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PemeranCarouselLayout;
