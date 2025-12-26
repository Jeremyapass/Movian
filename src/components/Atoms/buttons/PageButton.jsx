import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const PageButton = ({ direction, onClick, className }) => {
  if (direction === "prev") {
    return (
      <Button variant="pageButton" size={"pageButton"} onClick={onClick} className={className}>
        <ChevronLeft />
      </Button>
    );
  } else if (direction === "next") {
    return (
      <Button variant="pageButton" size={"pageButton"} onClick={onClick} className={className}>
        <ChevronRight />
      </Button>
    );
  }
};

export default PageButton;
