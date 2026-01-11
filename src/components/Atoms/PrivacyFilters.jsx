import React from "react";
import { Button } from "../ui/button";

const PrivacyFilters = ({ onClick, filterType }) => {
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
        value="public"
        className={`text-white ${filterType === "public" ? "bg-[#444]" : ""}`}
        onClick={onClick}
      >
        Public
      </Button>
      <Button
        value="private"
        className={`text-white ${filterType === "private" ? "bg-[#444]" : ""}`}
        onClick={onClick}
      >
        Private
      </Button>
    </div>
  );
};

export default PrivacyFilters;
