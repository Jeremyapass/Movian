"use client";
import React, { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "../ui/button";
import { fonts } from "@/fonts/fonts";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import ImageCropper from "@/components/Atoms/ImageCropper";
import { getCroppedImg } from "@/lib/cropImage";
import Image from "next/image";
import { useUpdateAccountCoverPicture } from "@/hookAPI/SUPABASE/publicSchema/account/useUpdateAccontCoverPicture";
import { supabase } from "@/lib/supabaseClient";
import { useRoot } from "@/provider/rootProvider";
import { toast } from "react-toastify";

const ProfileBackground = () => {
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const { getAccountDetailData } = useRoot();
  const { mutate: updateCoverPicture, isPending: isUpdatePending } =
    useUpdateAccountCoverPicture();

  const currentCoverPicture = getAccountDetailData?.cover_picture;

  const openFilePicker = () => {
    setOpen(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validasi tipe file
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.warning("Tipe file tidak didukung! Gunakan JPG, JPEG, WEBP, atau PNG.");
        return;
      }

      // Validasi ukuran file (800KB = 800 * 1024 bytes)
      const maxSize = 800 * 1024;
      if (file.size > maxSize) {
        toast.warning("Ukuran file terlalu besar! Maksimal 800KB.");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedAreaPixels) => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      setCroppedImage(croppedImageUrl);
      setCroppedImageBlob(croppedImageBlob);
      setShowCropper(false);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    setCroppedImageBlob(null);
    setImageSrc(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setShowCropper(false);
    setImageSrc(null);
    setCroppedImage(null);
    setCroppedImageBlob(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!croppedImageBlob) {
      toast.warning("Silakan pilih gambar terlebih dahulu!");
      return;
    }

    try {
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.webp`;

      const { data, error } = await supabase.storage
        .from("profile-cover-image")
        .upload(fileName, croppedImageBlob, {
          contentType: "image/webp",
          upsert: false,
        });

      if (error) {
        toast.error("Gagal upload gambar: " + error.message);
        return;
      }

      // Dapatkan public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-cover-image").getPublicUrl(data.path);

      updateCoverPicture(
        { cover_picture: publicUrl },
        {
          onSuccess: () => {
            handleCloseDialog();
          },
          onError: (error) => {
            console.error("Error updating cover picture:", error);
            toast.error("Gagal update cover picture!");
          },
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Terjadi kesalahan saat upload gambar!");
    }
  };

  return (
    <>
      <div
        className="relative w-full h-[50vh] rounded-3xl overflow-hidden group cursor-pointer"
        onClick={openFilePicker}
      >
        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center bg-[#1A1A1A] rounded-[24px] overflow-hidden">
          {currentCoverPicture ? (
            <Image
              src={currentCoverPicture}
              alt="Cover"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <span
              className={`${fonts.clash.className} bg-gradient-to-r text-[32px] font-semibold from-[#7B61FF] to-[#FF6F91] bg-clip-text text-transparent`}
            >
              MVN.
            </span>
          )}
        </div>

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

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCloseDialog();
          } else {
            setOpen(isOpen);
          }
        }}
      >
        <DialogContent
          aria-describedby={undefined}
          className="max-w-2xl max-h-[90vh] overflow-y-auto dark-scrollbar"
          onPointerDownCapture={(e) => {
            if (showCropper) return;
          }}
          onMouseDownCapture={(e) => {
            if (showCropper) return;
          }}
          onInteractOutside={(e) => {
            if (showCropper) {
              e.preventDefault();
              return;
            }
          }}
        >
          <DialogTitle>
            {showCropper ? "Crop Gambar" : "Update Cover Picture"}
          </DialogTitle>

          {showCropper ? (
            <ImageCropper
              imageSrc={imageSrc}
              onCropComplete={handleCropComplete}
              onCancel={handleCancelCrop}
              aspect={21 / 9}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <label
                className={`${fonts.satoshi.className} text-sm text-gray-300`}
              >
                Cover Picture
              </label>

              {croppedImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0D0D0D] group">
                  <Image
                    src={croppedImage}
                    alt="Cropped preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-600 hover:border-[#7B61FF] bg-[#0D0D0D] hover:bg-[#1A1A1A] cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                >
                  <Camera size={32} className="text-gray-400" />
                  <p
                    className={`${fonts.satoshi.className} text-sm text-gray-400 text-center px-4`}
                  >
                    Klik untuk upload cover picture
                  </p>
                  <p
                    className={`${fonts.satoshi.className} text-xs text-gray-500`}
                  >
                    Max 800KB • PNG, JPG, JPEG, WEBP
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {!showCropper && (
            <DialogFooter className="flex flex-col gap-2 pt-4 w-full">
              <Button
                className="w-fit bg-[#7B61FF] hover:bg-[#7B61FF]/80"
                onClick={handleSubmit}
                disabled={isUpdatePending || !croppedImageBlob}
              >
                {isUpdatePending ? "Mengupdate..." : "Update"}
              </Button>

              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseDialog();
                }}
                className="hover:bg-[#2F2F2F]"
              >
                Batal
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileBackground;
