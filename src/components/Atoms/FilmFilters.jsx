import React from "react";
import { Button } from "../ui/button";

const FilmFilters = ({ onClick, filterType }) => {
  return (
    <div className="border-[#2E2E2E] border-[1px] gap-1 rounded-xl p-1 flex">
      <Button
        className={`text-white ${filterType === "all" ? "bg-[#444]" : ""}`}
        value="all"
        onClick={onClick}
      >
        Semua
      </Button>
      <Button
        value="movie"
        className={`text-white ${filterType === "movie" ? "bg-[#444]" : ""}`}
        onClick={onClick}
      >
        Film
      </Button>
      <Button
        value="series"
        className={`text-white ${filterType === "series" ? "bg-[#444]" : ""}`}
        onClick={onClick}
      >
        Series
      </Button>
    </div>
  );
};

export default FilmFilters;
