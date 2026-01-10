import axios from "axios";

export function GET(req) {
  return axios
    .get(`${process.env.API_URL_TMDB}/genre/tv/list`, {
      params: {
        api_key: process.env.API_KEY_TMDB,
        language: "en",
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
