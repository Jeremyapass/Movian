"use client";
import FilmDetailLayout from "@/components/Organism/layouts/FilmDetailLayout";
import { useGetSeriesDetails } from "@/hookAPI/TMDB/series/UseGetSeriesDetails";
import { useParams } from "next/navigation";
import React from "react";

const SeriesDetailPage = () => {
  const { seriesId } = useParams();
  const { data: seriesDetailsData, isLoading: isSeriesDetailsLoading } =
    useGetSeriesDetails(seriesId);

  console.log(seriesDetailsData);
  return (
    <div className=" w-full">
      <FilmDetailLayout
        media_type="series"
        data={seriesDetailsData}
        isLoading={isSeriesDetailsLoading}
      />
    </div>
  );
};

export default SeriesDetailPage;
