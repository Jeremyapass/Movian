import axios from "axios";

export async function GET(req, context) {
  const { movies_id } = await context.params;

  return axios
    .get(`${process.env.API_URL_TMDB}/movie/${movies_id}`, {
      params: {
        api_key: process.env.API_KEY_TMDB,
        append_to_response:
          "account_states,credits,images,recommendations,reviews,videos,watch/providers, media_type",
      },
    })
    .then((res) => {
      return new Response(JSON.stringify(res.data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    })
    .catch((error) => {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    });
}
