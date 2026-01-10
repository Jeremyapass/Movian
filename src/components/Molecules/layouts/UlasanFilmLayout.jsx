import React, { useEffect, useState } from "react";
import ahay from "../../../../public/avatar-image.png";
import RateButton from "@/components/Atoms/buttons/RateButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fonts } from "@/fonts/fonts";
import AddReviewSkeleton from "@/components/Skeletons/AddReviewSkeleton";
import { useRoot } from "@/provider/rootProvider";
import { useAddReview } from "@/hookAPI/SUPABASE/publicSchema/review/useAddReview";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const UlasanFilmLayout = ({
  tmdbMovieId,
  reviews = [],
  averageRating = 0,
  filmData,
  media_type,
  isLoading,
}) => {
  const { getAccountDetailData, isGetAccountDetailLoading } = useRoot();

  const getRateVariant = (rate) => {
    if (rate < 25) return "rateRed";
    if (rate < 50) return "rateRed";
    if (rate < 75) return "rateYellow";
    return "ratePurple";
  };

  const totalReviews = reviews?.length || 0;

  // Only consider data loading, not account loading
  // Account loading should not block showing reviews to non-logged-in users
  const isLoadingData = isLoading;

  // Separate user's review from other reviews (only if user is logged in)
  const userReview = getAccountDetailData
    ? reviews?.find((review) => review.user_id === getAccountDetailData?.id)
    : null;
  const otherReviews = getAccountDetailData
    ? reviews?.filter((review) => review.user_id !== getAccountDetailData?.id)
    : reviews; // Show all reviews if user is not logged in

  return (
    <div className="flex flex-col gap-6">
      <h1 className={`${fonts.clash.className} text-2xl font-semibold`}>
        Ulasan ({totalReviews})
      </h1>

      <div className="flex flex-col items-center justify-center gap-3">
        <p className="text-[20px]">Skor rerata pengguna </p>
        {isLoadingData ? (
          <div className="w-[120px] h-[55px] rounded-full bg-[#2f2f2f] animate-pulse" />
        ) : (
          <Button
            variant={getRateVariant(averageRating)}
            size="rateButton"
            className="w-[120px] h-[55px] text-[30px]"
          >
            {averageRating}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* Show loading skeleton only while data is loading */}
        {isLoadingData ? (
          <AddReviewSkeleton />
        ) : getAccountDetailData ? (
          // User is logged in - show their review or add review form
          userReview ? (
            <UserReview review={userReview} />
          ) : (
            <AddReview
              tmdbMovieId={tmdbMovieId}
              filmData={filmData}
              media_type={media_type}
            />
          )
        ) : (
          // User is not logged in - show login prompt
          <AddReview
            tmdbMovieId={tmdbMovieId}
            filmData={filmData}
            media_type={media_type}
          />
        )}

        {/* Show other reviews - visible to everyone */}
        {!isLoadingData && (
          <Reviews reviews={otherReviews} hasAnyReviews={totalReviews > 0} />
        )}
      </div>
    </div>
  );
};

const AddReview = ({ tmdbMovieId, filmData, media_type }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [comment, setComment] = useState("");
  const route = useRouter();
  const { getAccountDetailData, isGetAccountDetailLoading } = useRoot();
  const { mutate: addReview, isPending: isAddingReview } = useAddReview();

  const handleSubmitReview = () => {
    if (selectedRating === null || !comment.trim()) {
      toast.warning("Pilih rating dan tulis komentar Anda");
      return;
    }

    addReview(
      {
        tmdbMovieId: tmdbMovieId,
        name: filmData?.title || filmData?.name,
        type: media_type,
        posterPath: filmData?.poster_path,
        releaseDate: filmData?.release_date || filmData?.first_air_date,
        comment: comment.trim(),
        rating: selectedRating,
      },
      {
        onSuccess: () => {
          setComment("");
          setSelectedRating(null);
          setIsWriting(false);
        },
        onError: (error) => {
          console.error("Error adding review:", error);
          toast.error("Gagal menambahkan review. Silakan coba lagi.");
        },
      }
    );
  };

  if (isGetAccountDetailLoading) return <AddReviewSkeleton />;

  if (!getAccountDetailData) {
    return (
      <div className="flex flex-col gap-[10px]      ">
        <div className="flex gap-[10px] items-center">
          <Image
            className="cursor-pointer rounded-full"
            src={ahay}
            alt="Profile"
            width={32}
            height={32}
          />
          <span className="">
            Kamu perlu masuk atau daftar untuk memberikan ulasan.
          </span>
        </div>
        <div className="flex gap-2 ml-[40px]">
          <Button
            className={"border-[1px] border-[#2E2E2E]"}
            onClick={() => route.push("/login")}
          >
            Masuk
          </Button>
          <Button variant={"purple"} onClick={() => route.push("/signup")}>
            Daftar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] ">
      <div className="flex gap-[10px] items-center">
        <Image
          className="cursor-pointer rounded-full"
          src={ahay}
          alt="Profile"
          width={32}
          height={32}
        />
        <div className="flex gap-1">
          <RateButton
            rateNumber={0}
            clickable={true}
            onClick={() => setSelectedRating(0)}
            isActive={selectedRating === 0}
          />
          <RateButton
            rateNumber={25}
            clickable={true}
            onClick={() => setSelectedRating(25)}
            isActive={selectedRating === 25}
          />
          <RateButton
            rateNumber={50}
            clickable={true}
            onClick={() => setSelectedRating(50)}
            isActive={selectedRating === 50}
          />
          <RateButton
            rateNumber={75}
            clickable={true}
            onClick={() => setSelectedRating(75)}
            isActive={selectedRating === 75}
          />
          <RateButton
            rateNumber={100}
            clickable={true}
            onClick={() => setSelectedRating(100)}
            isActive={selectedRating === 100}
          />
        </div>
        {selectedRating !== null && (
          <span className="text-sm text-gray-400">
            Rating terpilih: {selectedRating}
          </span>
        )}
      </div>

      <div className="ml-[40px] flex">
        <Textarea
          className="flex-1 py-5 border-0 bg-[#1E1E1E] min-h-[80px]"
          placeholder="Tulis ulasan Anda..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={() => setIsWriting(true)}
        />
      </div>

      {isWriting && (
        <div className="flex gap-2 self-end ml-[40px]">
          <Button
            onClick={() => {
              setIsWriting(false);
              setComment("");
              setSelectedRating(null);
            }}
            disabled={isAddingReview}
          >
            Batal
          </Button>

          <Button
            variant="purple"
            onClick={handleSubmitReview}
            disabled={
              isAddingReview || selectedRating === null || !comment.trim()
            }
          >
            {isAddingReview ? "Mengirim..." : "Beri Ulasan"}
          </Button>
        </div>
      )}
    </div>
  );
};

const UserReview = ({ review }) => {
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "1 hari yang lalu";
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
    if (diffInDays < 365)
      return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffInDays / 365)} tahun yang lalu`;
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className={`${fonts.clash.className} text-xl font-semibold`}>
        Ulasan Saya
      </h2>
      <div className="flex flex-col gap-[10px] p-4 bg-[#1A1A1A] rounded-xl">
        <div className="flex gap-[10px] items-center">
          <Image
            className="rounded-full cursor-pointer"
            src={ahay}
            alt="Profile"
            width={32}
            height={32}
          />
          <span>{review.public_user?.username || "Pengguna"}</span>
        </div>

        <div className="flex gap-[10px] ml-[40px] items-center">
          <RateButton rateNumber={review.rating} clickable={false} />
          <p className="text-[#A1A1AA]">{formatTimeAgo(review.created_at)}</p>
        </div>

        <p className="ml-[40px]">{review.comment}</p>
      </div>
    </div>
  );
};

const Reviews = ({ reviews = [], hasAnyReviews = false }) => {
  const route = useRouter();

  // If no reviews at all, show generic empty state
  if (!hasAnyReviews) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
        <p className="text-gray-400">Belum ada ulasan untuk film ini</p>
        <p className="text-sm text-gray-500">
          Jadilah yang pertama memberikan ulasan!
        </p>
      </div>
    );
  }

  // If there are reviews but none from others, don't show this section
  if (reviews.length === 0) {
    return null;
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Hari ini";
    if (diffInDays === 1) return "1 hari yang lalu";
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    if (diffInDays < 30)
      return `${Math.floor(diffInDays / 7)} minggu yang lalu`;
    if (diffInDays < 365)
      return `${Math.floor(diffInDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffInDays / 365)} tahun yang lalu`;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className={`${fonts.clash.className} text-xl font-semibold`}>
        Ulasan pengguna lain
      </h2>
      {reviews.map((review, index) => (
        <div
          key={`${review.user_id}-${index}`}
          className="flex flex-col gap-[10px]"
        >
          <div className="flex gap-[10px] items-center">
            <Image
              className="rounded-full cursor-pointer"
              src={ahay}
              alt="Profile"
              width={32}
              height={32}
            />
            <span>{review.public_user?.username || "Pengguna"}</span>
          </div>

          <div className="flex gap-[10px] ml-[40px] items-center">
            <RateButton rateNumber={review.rating} clickable={false} />
            <p className="text-[#A1A1AA]">{formatTimeAgo(review.created_at)}</p>
          </div>

          <p className="ml-[40px]">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default UlasanFilmLayout;
