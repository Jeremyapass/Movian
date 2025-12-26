import axios from "axios";

export const GET = (req) => {
  return axios
    .get(`${process.env.API_URL_TMDB}/tv/top_rated`, {
      params: {
        api_key: process.env.API_KEY_TMDB,
        language: "en-US",
        page: 1,
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
};
