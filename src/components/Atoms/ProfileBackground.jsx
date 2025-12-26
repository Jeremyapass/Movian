"use client";
import React, { useRef } from "react";
import ProfileBackgroundPict from "../../../public/profileBackgroundPict.png";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Button } from "../ui/button";

const ProfileBackground = () => {
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative w-full h-[50vh] rounded-3xl overflow-hidden group cursor-pointer"
      onClick={openFilePicker}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {/* Image */}
      <Image
        src={ProfileBackgroundPict}
        alt="Profile Background"
        className="w-full h-full object-fill rounded-3xl pointer-events-none"
      />

      {/* Overlay */}
      <div
        className="
            absolute inset-0 
            bg-[#4242423e]
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-300
          "
      />

      {/* Camera Button */}
      <Button
        onClick={openFilePicker}
        className="
            absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
            h-[40px] w-[40px] flex items-center justify-center p-2 rounded-full 
            bg-[rgba(42,42,42,0.40)]
            opacity-0 group-hover:opacity-100
            transition-all duration-300 pointer-events-none
            z-10 
          "
      >
        <Camera className="h-[24px] w-[24px]" />
      </Button>
    </div>
  );
};

export default ProfileBackground;
