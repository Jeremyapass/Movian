"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Star, Loader2 } from "lucide-react";
import React, { useMemo, useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useAddFavoriteMovies } from "@/hookAPI/SUPABASE/publicSchema/favorite/useAddFavorite";
import { useDeleteFavoriteMovies } from "@/hookAPI/SUPABASE/publicSchema/favorite/useDeleteFavorite";
import { useGetAllFavoriteMovies } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetAllFavoriteMovies";
import { useGetAllFavoriteSeries } from "@/hookAPI/SUPABASE/publicSchema/favorite/useGetAllFavoriteSeries";
import { useRoot } from "@/provider/rootProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UI_DELAY = 400;

const AddFavButton = ({
  tmdbMovieId,
  name,
  type,
  posterPath,
  dateRelease,
  onCard = false,
  //isFavorite,
}) => {
  const starRef = useRef(null);
  const { getAccountDetailData } = useRoot();
  const router = useRouter();

  const { data: favoriteData, isLoading: isFavoriteLoading } =
    type === "movie"
      ? useGetAllFavoriteMovies({ tmdbId: tmdbMovieId, enabled: !!tmdbMovieId })
      : useGetAllFavoriteSeries({
          tmdbId: tmdbMovieId,
          enabled: !!tmdbMovieId,
        });

  const favorites = favoriteData?.data ?? [];

  const { mutate: addFav, isPending: isAddLoading } = useAddFavoriteMovies();
  const { mutate: deleteFav, isPending: isDeleteLoading } =
    useDeleteFavoriteMovies();

  const favLoading = isAddLoading || isDeleteLoading || isFavoriteLoading;

  // 🔥 State UI
  const [uiLoading, setUiLoading] = useState(false);
  const serverFavorite = useMemo(
    () =>
      favorites.find((fav) => fav.movie_cache?.tmdb_movie_id === tmdbMovieId),
    [favorites, tmdbMovieId]
  );

  const serverActive = !!serverFavorite;
  const [uiActive, setUiActive] = useState(serverActive);

  useEffect(() => {
    if (!uiLoading) {
      setUiActive(serverActive);
    }
  }, [serverActive, uiLoading]);

  useEffect(() => {
    if (!starRef.current || uiLoading) return;

    gsap.fromTo(
      starRef.current,
      { scale: 0.6, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }
    );
  }, [uiActive, uiLoading]);

  const handleClick = (e) => {
    e.stopPropagation();

    // Check if user is logged in
    if (!getAccountDetailData) {
      toast.info("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (favLoading || uiLoading) return;

    setUiLoading(true);

    const finish = () => setTimeout(() => setUiLoading(false), UI_DELAY);

    if (!uiActive) {
      // Add favorite
      addFav(
        { tmdbMovieId, name, type, posterPath, dateRelease },
        { onSettled: finish }
      );
    } else if (serverFavorite?.id) {
      // Delete favorite
      deleteFav(serverFavorite.movie_cache.tmdb_movie_id, {
        onSettled: finish,
      });
    } else {
      finish();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={favLoading || uiLoading}
      className={clsx(
        "relative rounded-full p-[14px]",
        uiActive
          ? "bg-[#FF6F91] hover:bg-[#FF6F91]/80"
          : onCard
          ? "bg-[#2A2A2A66] hover:bg-[#2F2F2F]"
          : "bg-[#2A2A2A] hover:bg-[#2F2F2F]",
        (favLoading || uiLoading) && "opacity-60 cursor-not-allowed"
      )}
    >
      <Star
        ref={starRef}
        className={clsx(
          "h-5 w-5 text-white transition-opacity",
          uiLoading && "opacity-30"
        )}
        fill={uiActive ? "white" : "none"}
      />
      {uiLoading && (
        <Loader2 className="absolute h-5 w-5 animate-spin text-white" />
      )}
    </Button>
  );
};

export default AddFavButton;
