import axios from "axios";

export async function GET(req, context) {
  const { movies_id } = await context.params;

  try {
    const { data } = await axios.get(
      `${process.env.API_URL_TMDB}/movie/${movies_id}`,
      {
        params: {
          api_key: process.env.API_KEY_TMDB,
          append_to_response:
            "credits,videos,recommendations,images,watch/providers", // ⭐ Hapus yang tidak perlu
        },
        timeout: 5000, // ⭐ Tambah timeout 5 detik
      }
    );

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // ⭐ Cache 5 menit
      },
    });
  } catch (error) {
    console.error("TMDB API Error:", error.message);
    return new Response(
      JSON.stringify({
        message: error.message,
        code: error.response?.status || 500,
      }),
      {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
