import PageButton from "@/components/Atoms/buttons/PageButton";
import { fonts } from "@/fonts/fonts";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import VideoCarouselLayoutSkeleton from "@/components/Skeletons/VideoLayoutSkeleton";

const VideoCarouselLayout = ({ data, isLoading }) => {
  const scrollRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);

  // ===== FILTER DATA =====
  const youtubeVideos = data?.filter((v) => v.site === "YouTube") || [];

  // ===== GSAP SCROLL (TIDAK DIUBAH) =====
  const getCardWidth = () => {
    const first = scrollRef.current?.children[0];
    if (!first) return 0;
    return first.offsetWidth + 4; // gap-1
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

  // ===== LOADING =====
  if (isLoading) {
    return <VideoCarouselLayoutSkeleton />;
  }

  // ===== EMPTY STATE =====
  if (!youtubeVideos.length) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <p className={`${fonts.clash.className} text-3xl font-semibold`}>
            Video
          </p>
        </div>

        <div className="flex items-center justify-center h-[284px] rounded-xl bg-[#1a1a1a] text-gray-400">
          Video belum tersedia
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <p className={`${fonts.clash.className} text-3xl font-semibold`}>
            Video
          </p>

          <div className="flex gap-[16px] items-center">
            <div className="gap-[6px] flex items-center">
              <PageButton direction="prev" onClick={handlePrev} />
              <PageButton direction="next" onClick={handleNext} />
            </div>
          </div>
        </div>

        {/* ===== CAROUSEL ===== */}
        <div
          ref={scrollRef}
          className="flex gap-3 w-full overflow-x-auto no-scrollbar grow-0"
        >
          {youtubeVideos.map((video, index) => (
            <div
              key={index}
              className="flex flex-col gap-[11px] group cursor-pointer w-[417px]"
              onClick={() => setActiveVideo(video)}
            >
              <div className="relative flex items-center justify-center w-[417px] h-[284px] rounded-[12px]">
                {/* THUMBNAIL */}
                <img
                  src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  alt={video.name}
                  className="object-cover transition-all duration-300 w-full h-full rounded-2xl"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-transparent rounded-2xl group-hover:bg-[#00000080] transition-all duration-300" />

                {/* PLAY ICON */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full bg-black/60 backdrop-blur-sm opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <Play
                      className="text-white ml-[2px]"
                      size={32}
                      fill="white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== MODAL VIDEO ===== */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-[90vw] max-w-5xl aspect-video rounded-xl overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.key}?autoplay=1&rel=0`}
              title={activeVideo.name}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />

            {/* CLOSE */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 text-white text-xl bg-black/60 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCarouselLayout;
 