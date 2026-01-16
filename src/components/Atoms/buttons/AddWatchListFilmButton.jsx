"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { Check, Plus, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useAddWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useAddWatchlistFilm";
import { useDeleteWatchlistFilm } from "@/hookAPI/SUPABASE/publicSchema/watchlist/watchlistFilm/useDeleteWatchlistFilm";
import { useRoot } from "@/provider/rootProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UI_DELAY = 400;

const AddWatchListFilmButton = ({
  watchlistData,
  watchlistFilmData,
  filmData,
  media_type,
  className,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [uiLoading, setUiLoading] = useState(false);

  const iconRef = useRef(null);
  const { getAccountDetailData } = useRoot();
  const router = useRouter();

  const { mutate: addWatchlistFilmMutate, isPending: isAdding } =
    useAddWatchlistFilm();
  const { mutate: deleteWatchlistFilmMutate, isPending: isDeleting } =
    useDeleteWatchlistFilm();

  const animateIcon = () => {
    if (!iconRef.current) return;
    gsap.fromTo(
      iconRef.current,
      { scale: 0.6, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(2)" }
    );
  };

  // Function untuk mendapatkan state awal selected
  const getInitialSelected = () => {
    if (!watchlistData || !watchlistFilmData || !filmData) return [];

    // Handle pagination structure
    const watchlists = Array.isArray(watchlistData)
      ? watchlistData
      : watchlistData.data || [];
    const watchlistFilms = Array.isArray(watchlistFilmData)
      ? watchlistFilmData
      : watchlistFilmData.data || [];

    return watchlists.filter((watchlist) =>
      watchlistFilms.some(
        (wf) =>
          wf.watchlist?.id === watchlist.id &&
          wf.movie_cache?.tmdb_movie_id === filmData.id
      )
    );
  };

  // Set initial selected dan isActive
  useEffect(() => {
    const preSelected = getInitialSelected();
    setSelected(preSelected);
    setIsActive(preSelected.length > 0);
  }, [watchlistData, watchlistFilmData, filmData]);

  // Reset selected saat dialog ditutup tanpa klik "Selesai"
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);

    // Jika dialog ditutup (termasuk tombol Batal), reset ke state awal
    if (!isOpen) {
      const initialSelected = getInitialSelected();
      setSelected(initialSelected);
    }
  };

  const handleCancel = () => {
    // Reset ke state awal
    const initialSelected = getInitialSelected();
    setSelected(initialSelected);
    setOpen(false);
  };

  const toggleSelect = (item) => {
    setSelected((prev) => {
      const exists = prev.find((w) => w.id === item.id);
      if (exists) return prev.filter((w) => w.id !== item.id);
      return [...prev, item];
    });
  };

  const handleDone = () => {
    if (!filmData) return;

    // Handle pagination structure
    const watchlists = Array.isArray(watchlistData)
      ? watchlistData
      : watchlistData.data || [];
    const watchlistFilms = Array.isArray(watchlistFilmData)
      ? watchlistFilmData
      : watchlistFilmData.data || [];

    const currentWatchlistIds = watchlistFilms
      .filter((wf) => wf.movie_cache?.tmdb_movie_id === filmData.id)
      .map((wf) => wf.watchlist?.id)
      .filter(Boolean);

    const toAdd = selected.filter((s) => !currentWatchlistIds.includes(s.id));
    const toDelete = watchlists.filter(
      (w) =>
        currentWatchlistIds.includes(w.id) &&
        !selected.some((s) => s.id === w.id)
    );

    setIsActive(selected.length > 0);
    animateIcon();
    setUiLoading(true);

    // Tutup dialog dan reset state
    setOpen(false);

    const onMutationComplete = () => {
      setUiLoading(false);
      // Reset selected ke state baru setelah mutation
      // State akan di-update otomatis oleh useEffect saat watchlistFilmData berubah
    };

    if (toAdd.length > 0) {
      const payload = toAdd.map((item) => ({
        tmdbMovieId: filmData.id,
        name: filmData.title || filmData.name,
        type: media_type,
        posterPath: filmData.poster_path,
        dateRelease: filmData.release_date || filmData.first_air_date,
        watchlistId: item.id,
      }));
      addWatchlistFilmMutate(payload, { onSettled: onMutationComplete });
    }

    if (toDelete.length > 0) {
      const payload = toDelete.map((item) => ({
        tmdbMovieId: filmData.id,
        watchlistId: item.id,
      }));
      deleteWatchlistFilmMutate(payload, {
        onSettled: onMutationComplete,
      });
    }

    if (toAdd.length === 0 && toDelete.length === 0) {
      setTimeout(onMutationComplete, UI_DELAY);
    }
  };



  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();

          // Check if user is logged in
          if (!getAccountDetailData) {
            toast.info("Silakan login terlebih dahulu");
            router.push("/login");
            return;
          }

          setOpen(true);
        }}
        disabled={uiLoading || isAdding || isDeleting}
        className={clsx(
          "relative rounded-full text-white p-[14px] h-[44px]",
          isActive
            ? "bg-[#7B61FF] hover:bg-[#7B61FF]/80"
            : `bg-[#2A2A2A] hover:bg-[#2F2F2F] ${className}`,
          (uiLoading || isAdding || isDeleting) &&
            "opacity-60 cursor-not-allowed"
        )}
      >
        <div ref={iconRef}>
          {uiLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isActive ? (
            <Check />
          ) : (
            <Plus />
          )}
        </div>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-sm" aria-describedby={undefined}>
          <DialogTitle>Tambahkan ke Watchlist</DialogTitle>

          {watchlistData?.length === 0 ? (
            <>
              <p className="text-sm text-muted-foreground mt-2">
                Anda belum memiliki watchlist. Silakan buat watchlist terlebih
                dahulu pada halaman watchlist.
              </p>

              <DialogFooter className="flex justify-end pt-4">
                <Button
                  className="bg-[#7B61FF] hover:bg-[#7B61FF]/80"
                  onClick={() => {
                    router.push("/watchlist");
                  }}s
                >
                  Tambah Watchlist
                </Button>
                <Button variant="ghost" onClick={handleCancel}>
                  Tutup
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="space-y-4 overflow-y-auto max-h-96 dark-scrollbar mt-4">
                {(() => {
                  const watchlists = Array.isArray(watchlistData)
                    ? watchlistData
                    : watchlistData?.data || [];

                  // Section berdasarkan data asli dari database, bukan dari state selected
                  const initialSelected = getInitialSelected();

                  const savedIn = watchlists.filter((item) =>
                    initialSelected.some((w) => w.id === item.id)
                  );
                  const recentlyUpdated = watchlists.filter(
                    (item) => !initialSelected.some((w) => w.id === item.id)
                  );

                  return (
                    <>
                      {savedIn.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground px-1">
                            Tersimpan di
                          </h3>
                          {savedIn.map((item) => {
                            const isSelected = selected.some(
                              (w) => w.id === item.id
                            );
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleSelect(item)}
                                className={clsx(
                                  "cursor-pointer rounded-md px-4 py-3 transition flex items-center justify-between",
                                  isSelected
                                    ? "bg-[#7B61FF]/20 text-[#7B61FF]"
                                    : "hover:bg-muted"
                                )}
                              >
                                <span>{item.name}</span>
                                {isSelected && <Check className="w-4 h-4" />}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {recentlyUpdated.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium text-muted-foreground px-1">
                            Baru Diperbarui
                          </h3>
                          {recentlyUpdated.map((item) => {
                            const isSelected = selected.some(
                              (w) => w.id === item.id
                            );
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleSelect(item)}
                                className={clsx(
                                  "cursor-pointer rounded-md px-4 py-3 transition flex items-center justify-between",
                                  isSelected
                                    ? "bg-[#7B61FF]/20 text-[#7B61FF]"
                                    : "hover:bg-muted"
                                )}
                              >
                                <span>{item.name}</span>
                                {isSelected && <Check className="w-4 h-4" />}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <DialogFooter className="flex flex-col gap-2 pt-4 w-full">
                <Button
                  onClick={handleDone}
                  disabled={isAdding || isDeleting}
                  className="w-fit bg-[#7B61FF] hover:bg-[#7B61FF]/80"
                >
                  Selesai
                </Button>

                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Batal
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddWatchListFilmButton;
