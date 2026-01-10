import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const page = searchParams.get("page") || 1;

    if (!query) {
      return new Response(
        JSON.stringify({ message: "query is required" }),
        { status: 400 }
      );
    }

    const res = await axios.get(
      `${process.env.API_URL_TMDB}/search/movie`,
      {
        params: {
          api_key: process.env.API_KEY_TMDB,
          query,
          language: "en-US",
          page,
        },
      }
    );

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
