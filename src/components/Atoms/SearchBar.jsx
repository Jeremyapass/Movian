'use client'
import { Search } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import gsap from "gsap";
import clsx from "clsx";
import { set } from "react-hook-form";

const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);

  const buttonRef = useRef(null);
  const inputWrapperRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isActive && inputWrapperRef.current) {
      gsap.fromTo(
        inputWrapperRef.current,
        { width: 0, opacity: 0 },
        {
          width: 329,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isActive]);

  const closeSearch = () => {
    if (!inputWrapperRef.current) return;

    gsap.to(inputWrapperRef.current, {
      width: 0,
      opacity: 0,
      duration: 0.7,
      ease: "back.in(1.7)",
      onComplete: () => {
        setIsActive(false);
      },
    });
  };

  useEffect(() => {
    let isProcessing = false;

    const handleClickOutside = (e) => {
      if (isProcessing) return;

      if (
        isActive &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        isProcessing = true;
        closeSearch();

        setTimeout(() => {
          isProcessing = false;
        }, 700); // Match the animation duration
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActive]);

  return (
    <InputGroup
      ref={containerRef}
      className={clsx(
        "text-white h-[44px] py-[12px] border-none ",
        isActive
          ? " "
          : "hover:bg-[#2A2A2A] transition-all duration-100 ease-in-out"
      )}
    >
      {isActive && (
        <InputGroupInput
          ref={inputWrapperRef}
          placeholder="Cari film atau series"
          autoFocus
        />
      )}

      <InputGroupAddon
        ref={buttonRef}
        className={clsx(isActive ? "" : "p-4 cursor-pointer")}
        onClick={!isActive ? () => setIsActive(true) : undefined}
      >
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchBar;
