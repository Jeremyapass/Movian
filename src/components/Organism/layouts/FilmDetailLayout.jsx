import Image from "next/image";
import React, { Suspense } from "react";
import ISO6391 from "iso-639-1";
import { findFlagUrlByIso2Code } from "country-flags-svg";
import { ArrowUpRight } from "lucide-react";
import { fonts } from "@/fonts/fonts";
import RateButton from "@/components/Atoms/buttons/RateButton";
import AddFavButton from "@/components/Atoms/buttons/AddFavButton";
import UlasanFilmLayout from "@/components/Molecules/layouts/UlasanFilmLayout";
import GambarCarouselLayout from "@/components/Molecules/carouselLayout/GambarCarouselLayout";
import PemeranCarouselLayout from "@/components/Molecules/carouselLayout/PemeranCarouselLayout";
import VideoCarouselLayout from "@/components/Molecules/carouselLayout/VideoCarouselLayout";
import AddWatchListFilmButton from "@/components/Atoms/buttons/AddWatchListFilmButton";
import { useGetMovieCacheId } from "@/hookAPI/SUPABASE/publicSchema/movieCache/useGetMovieCacheId";
import { useGetFilmReview } from "@/hookAPI/SUPABASE/publicSchema/review/useGetFilmReview";
import { calculateAverageRating } from "@/lib/ratingUtils";
import GambarCarouselLayoutSkeleton from "@/components/Skeletons/GambarLayoutSkeleton";
import PemeranCarouselLayoutSkeleton from "@/components/Skeletons/PemeranLayoutSkeleton";
import VideoCarouselLayoutSkeleton from "@/components/Skeletons/VideoLayoutSkeleton";

const FilmDetailLayout = ({
  watchlistData,
  watchlistFilmData,
  data,
  isLoadingFilmDetails,
  isLoadingWatchlist,
  isLoadingWatchlistFilm,
  media_type,
  tmdbMovieId,
}) => {
  const { data: movieCacheId, isLoading: isLoadingMovieCacheId } =
    useGetMovieCacheId(tmdbMovieId);
  const { data: reviews = [], isLoading: isLoadingReviews } =
    useGetFilmReview(movieCacheId);
  const averageRating = calculateAverageRating(reviews);

  // Loading states untuk setiap bagian - lebih granular untuk performance
  const isLoadingBasicInfo = isLoadingFilmDetails;
  const isLoadingCast = isLoadingFilmDetails;
  const isLoadingImages = isLoadingFilmDetails;
  const isLoadingVideos = isLoadingFilmDetails;
  const isLoadingReviewSection = isLoadingMovieCacheId || isLoadingReviews;

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex flex-col gap-8 w-full ">
        {data?.backdrop_path ? (
          <div
            className="cursor-pointer group relative px-[26px] py-[14px] w-full flex h-[60vh] flex-col justify-between rounded-3xl bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${data.backdrop_path})`,
            }}
          />
        ) : isLoadingBasicInfo ? (
          // SKELETON
          <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden bg-[#2f2f2f] animate-pulse" />
        ) : (
          // NO BACKDROP - Show MVN like profile cover
          <div className="relative w-full h-[60vh] flex items-center justify-center bg-[#1A1A1A] rounded-[24px] overflow-hidden">
            <span
              className={`${fonts.clash.className} bg-gradient-to-r text-[32px] font-semibold from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
            >
              MVN.
            </span>
          </div>
        )}

        <div className="flex gap-6 w-full">
          <Kiri data={data} isLoading={isLoadingBasicInfo} />
          <Kanan
            data={data}
            isLoading={isLoadingBasicInfo}
            isLoadingCast={isLoadingCast}
            isLoadingImages={isLoadingImages}
            isLoadingVideos={isLoadingVideos}
            isLoadingReviews={isLoadingReviewSection}
            media_type={media_type}
            watchlistData={watchlistData}
            watchlistFilmData={watchlistFilmData}
            isLoadingWatchlist={isLoadingWatchlist}
            isLoadingWatchlistFilm={isLoadingWatchlistFilm}
            tmdbMovieId={tmdbMovieId}
            reviews={reviews}
            averageRating={averageRating}
          />
        </div>
      </div>
    </div>
  );
};

const HeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      {/* Title */}
      <div className="h-[48px] w-[70%] rounded-md bg-[#2f2f2f]" />

      {/* Meta info */}
      <div className="flex gap-2 items-center">
        <div className="h-[24px] w-[50px] rounded-md bg-[#2f2f2f]" />
        <div className="h-[20px] w-[120px] rounded-md bg-[#2f2f2f]" />
        <div className="h-[20px] w-[80px] rounded-md bg-[#2f2f2f]" />
      </div>
    </div>
  );
};

const Header = ({ data, isLoading }) => {
  if (isLoading || !data) return <HeaderSkeleton />;

  const runtime =
    data?.runtime ??
    (data?.episode_run_time?.length > 0 ? data.episode_run_time[0] : null);

  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className={`${fonts.clash.className} text-5xl font-semibold`}>
        {data?.title || data?.name} (
        {data?.release_date?.slice(0, 4) || data?.first_air_date?.slice(0, 4)})
      </h1>

      <div className="flex gap-1 items-center flex-wrap">
        <span className="bg-[#2F2F2F] px-2 py-1 rounded-md text-sm">
          {data?.adult ? "18+" : "Semua Umur"}
        </span>

        {(data?.release_date || data?.first_air_date) && (
          <span>
            {new Date(
              data.release_date || data.first_air_date
            ).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}

        <span className="mx-1">·</span>

        {data?.genres?.map((genre) => genre.name).join(" / ")}

        {runtime && (
          <>
            <span className="mx-1">·</span>
            <span>
              {Math.floor(runtime / 60)}j {runtime % 60}m
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const Kanan = ({
  data,
  isLoading,
  isLoadingCast,
  isLoadingImages,
  isLoadingVideos,
  isLoadingReviews,
  media_type,
  watchlistData,
  watchlistFilmData,
  isLoadingWatchlist,
  isLoadingWatchlistFilm,
  tmdbMovieId,
  reviews,
  averageRating,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full min-w-0">
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex gap-1 items-center">
            <div className="w-[48px] h-[24px] rounded-full bg-[#2f2f2f] animate-pulse" />
            <span className="text-sm">Skor rerata pengguna</span>
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <RateButton rateNumber={averageRating} clickable={false} />
            <span className="text-sm">Skor rerata pengguna</span>
          </div>
        )}

        <Header data={data} isLoading={isLoading} />

        <div className="flex gap-2">
          <AddFavButton
            tmdbMovieId={data?.id}
            name={data?.title || data?.name}
            type={media_type}
            posterPath={data?.poster_path}
            dateRelease={data?.release_date || data?.first_air_date}
            //isFavorite={isFavorite}
          />
          <AddWatchListFilmButton
            watchlistData={watchlistData}
            watchlistFilmData={watchlistFilmData}
            filmData={data}
            media_type={media_type}
            isLoadingWatchlist={isLoadingWatchlist}
            isLoadingWatchlistFilm={isLoadingWatchlistFilm}
          />
        </div>
      </div>

      <div className="flex bg-[#1A1A1A] p-6 rounded-xl flex-col gap-4">
        <h1 className="text-xl font-semibold">Kilasan singkat</h1>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-[#2f2f2f] animate-pulse" />
            <div className="h-4 w-[90%] rounded bg-[#2f2f2f] animate-pulse" />
            <div className="h-4 w-[95%] rounded bg-[#2f2f2f] animate-pulse" />
          </div>
        ) : (
          <p>{data?.overview}</p>
        )}
      </div>

      <Suspense fallback={<PemeranCarouselLayoutSkeleton />}>
        <PemeranCarouselLayout
          data={data?.credits?.cast}
          isLoading={isLoadingCast}
        />
      </Suspense>

      <Suspense fallback={<GambarCarouselLayoutSkeleton />}>
        <GambarCarouselLayout
          data={data?.images?.posters}
          isLoading={isLoadingImages}
        />
      </Suspense>

      <Suspense fallback={<VideoCarouselLayoutSkeleton />}>
        <VideoCarouselLayout
          data={data?.videos?.results}
          isLoading={isLoadingVideos}
        />
      </Suspense>

      <UlasanFilmLayout
        tmdbMovieId={tmdbMovieId}
        reviews={reviews}
        averageRating={averageRating}
        filmData={data}
        media_type={media_type}
        isLoading={isLoadingReviews}
      />
    </div>
  );
};

const Kiri = ({ data, isLoading }) => {
  return (
    <div className="flex flex-col gap-6 w-[270px] shrink-0">
      {isLoading ? (
        /* SKELETON */
        <div className="w-[270px] h-[348px] rounded-xl bg-[#2f2f2f] animate-pulse" />
      ) : data?.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w342${data.poster_path}`}
          alt="SeriesImages"
          width={270}
          height={348}
          className="object-cover transition-all duration-300 w-[270px] h-[348px] rounded-xl"
          priority
          loading="eager"
        />
      ) : (
        /* NO POSTER - Show MVN like watchlist */
        <div className="w-[270px] h-[348px] rounded-xl bg-[#0D0D0D] flex items-center justify-center">
          <span
            className={`${fonts.clash.className} bg-gradient-to-r text-[32px] font-semibold from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
          >
            MVN.
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 bg-[#1A1A1A] p-6 justify-center rounded-xl">
        <h1 className="font-semibold text-xl">Tentang film</h1>

        <div className="flex flex-col">
          <p className="font-semibold ">Status</p>
          <div className="flex items-center gap-2">
            <p>{data?.status}</p>
            {data?.status === "Released" && (
              <span className="text-green-500">✓</span>
            )}
          </div>
        </div>
        <div className="flex flex-col ">
          <p className="font-semibold ">Bahasa</p>
          <p>{ISO6391.getName(data?.original_language)}</p>
        </div>

        <div className="flex flex-col">
          <p className="font-semibold mb-1">Negara Produksi</p>
          <div className="flex flex-col gap-1">
            {data?.production_countries?.map((country) => {
              const flagUrl = findFlagUrlByIso2Code(
                country.iso_3166_1.toLowerCase()
              );

              return (
                <div
                  key={country.iso_3166_1}
                  className="flex items-center gap-2"
                >
                  {/* Wrapper untuk masking */}
                  {flagUrl ? (
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                      <Image
                        src={flagUrl}
                        alt={country.name}
                        width={30}
                        height={30}
                        className="w-[30px] h-[30px] object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full bg-[#2F2F2F] flex items-center justify-center">
                      <span className="text-[10px]">🌐</span>
                    </div>
                  )}

                  <p>{country.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col ">
          <p className="font-semibold mb-1">Studio Produksi</p>

          <div className="flex flex-col gap-1">
            {data?.production_companies?.map((data) => (
              <div key={data.id} className="flex items-center gap-2">
                {data.logo_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w154${data.logo_path}`}
                    alt={data.name}
                    width={30}
                    height={30}
                    className="object-contain w-[30px] h-[30px] rounded-full bg-white "
                  />
                ) : (
                  <div
                    className={`w-[30px] h-[30px] flex items-center justify-center rounded-full bg-[#0D0D0D] ${fonts.clash.className} font-semibold text-[10px]`}
                  >
                    <span className="bg-gradient-to-r from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent">
                      MVN.
                    </span>
                  </div>
                )}

                <p className="text-sm text-center">
                  {data.name.length > 25
                    ? `${data.name.slice(0, 25)}...`
                    : data.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="font-semibold">Penyedia Layanan Streaming</p>

          {data?.["watch/providers"]?.results?.ID?.flatrate == null && "-"}

          <div className="flex flex-col gap-1">
            {data?.["watch/providers"]?.results?.ID?.flatrate?.map(
              (provider, index) => (
                <div
                  key={index}
                  className="flex gap-1 text-sm items-center cursor-pointer w-fit "
                  onClick={() =>
                    window.open(
                      data?.["watch/providers"]?.results?.ID?.link,
                      "_blank"
                    )
                  }
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w154${provider.logo_path}`}
                    alt={provider.provider_name}
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px] object-contain rounded-full"
                  />
                  <p>
                    {provider.provider_name.length > 25
                      ? `${provider.provider_name.slice(0, 25)}...`
                      : provider.provider_name}
                  </p>
                  <ArrowUpRight width={15} height={15} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilmDetailLayout;
