import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const genreId = searchParams.get("genreId");
    const page = searchParams.get("page") || 1;

    if (!genreId) {
      return new Response(JSON.stringify({ message: "genreId is required" }), {
        status: 400,
      });
    }

    const res = await axios.get(`${process.env.API_URL_TMDB}/discover/tv`, {
      params: {
        api_key: process.env.API_KEY_TMDB,
        with_genres: genreId,
        page,
        language: "en-US",
        sort_by: "popularity.desc",
      },
    });

    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.response?.data?.status_message || error.message,
      }),
      { status: 500 }
    );
  }
}
