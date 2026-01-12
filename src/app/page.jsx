"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Banner from "@/components/Atoms/Banner";
import { MainProvider, useMain } from "@/provider/mainProvider";
import CarouselLayout from "@/components/Molecules/carouselLayout/CarouselLayout";

const PageConent = () => {
  const {
    nowPlayingData,
    popularData,
    upcomingData,
    topRatedData,
    airingTodaySeriesData,
    isnowPlayingLoading,
    isPopularLoading,
    isUpcomingLoading,
    isTopRatedLoading,
    isAiringTodaySeriesLoading,
    handleViewAllClickMovies,
    handleViewAllClickSeries,
  } = useMain();

  return (
    <div
      className={`flex flex-col gap-12 justify-center h-full items-center w-full`}
    >
      <Banner data={nowPlayingData?.results} />
      <CarouselLayout
        type={"movie"}
        title={"Film Populer"}
        subtitle={"Pilihan film yang paling banyak ditonton dan disukai."}
        data={popularData?.results}
        isLoading={isPopularLoading}
        onViewAllClick={() => handleViewAllClickMovies("popular")}
      />
      <CarouselLayout
        type={"series"}
        title={"Serial Tayang Hari Ini"}
        subtitle={"Episode terbaru yang tayang hari ini."}
        data={airingTodaySeriesData?.results}
        isLoading={isAiringTodaySeriesLoading}
        onViewAllClick={() => handleViewAllClickSeries("airing-today")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Rilis Terbaru"}
        subtitle={"Film yang baru dirilis."}
        data={upcomingData?.results}
        isLoading={isUpcomingLoading}
        onViewAllClick={() => handleViewAllClickMovies("upcoming")}
      />
      <CarouselLayout
        type={"movie"}
        title={"Disukai Penonton"}
        subtitle={"Film yang paling disukai penonton."}
        data={topRatedData?.results}
        isLoading={isTopRatedLoading}
        onViewAllClick={() => handleViewAllClickMovies("top-rated")}
      />
    </div>
  );
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Ambil hash dari Supabase email link
    const hash = window.location.hash; // #access_token=... atau #error=...
    if (!hash) return;

    const params = new URLSearchParams(hash.replace(/^#/, "")); // hapus #
    const access_token = params.get("access_token");
    const error = params.get("error");

    if (error) {
      // Redirect ke halaman error
      const errorUrl = new URL("/signup/verification-email/error", window.location.origin);
      params.forEach((value, key) => {
        errorUrl.searchParams.set(key, value);
      });
      router.replace(errorUrl.toString());
      return;
    }

    if (access_token) {
      // Redirect ke auth/callback dengan membawa semua hash sebagai query params
      const callbackUrl = new URL("/signup/verification-email/success", window.location.origin);
      params.forEach((value, key) => {
        callbackUrl.searchParams.set(key, value);
      });
      router.replace(callbackUrl.toString());
      return;
    }
  }, [router]);

  return (
    <MainProvider>
      <PageConent />
    </MainProvider>
  );
}
