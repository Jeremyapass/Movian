import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddReview = async ({
  tmdbMovieId,
  name,
  type,
  posterPath,
  releaseDate,
  comment,
  rating,
}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user?.id) throw new Error("Unauthorized");

  // 1️⃣ cek movie_cache
  const { data: existingMovie, error: movieError } = await supabase
    .from("movie_cache")
    .select("id")
    .eq("tmdb_movie_id", tmdbMovieId)
    .eq("type", type)
    .single();

  let movieCacheId = existingMovie?.id;

  // 2️⃣ kalau belum ada → insert
  if (!movieCacheId) {
    const { data: insertedMovie, error: insertError } = await supabase
      .from("movie_cache")
      .insert({
        tmdb_movie_id: tmdbMovieId,
        name,
        type,
        poster_path: posterPath,
        date_release: releaseDate,
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    movieCacheId = insertedMovie.id;
  }

  // 3️⃣ insert review
  const { data: reviewData, error: reviewError } = await supabase
    .from("reviewed_films")
    .insert({
      user_id: user.id,
      movie_cache_id: movieCacheId,
      comment,
      rating,
    })
    .select()
    .single();

  if (reviewError) throw reviewError;

  return reviewData;
};

export default AddReview;

export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-film-review"],
    mutationFn: AddReview,
    onSuccess: (data) => {
      // Only invalidate the specific review query for this movie
      queryClient.invalidateQueries({
        queryKey: ["get-film-review"],
      });
    },
  });
};
