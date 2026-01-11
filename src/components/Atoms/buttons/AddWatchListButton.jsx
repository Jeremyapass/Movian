import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fonts } from "@/fonts/fonts";
import ImageCropper from "@/components/Atoms/ImageCropper";
import DropdownPrivacyButton from "@/components/Atoms/buttons/DropdownPrivacyButton";
import { getCroppedImg } from "@/lib/cropImage";
import { Plus, Upload, X } from "lucide-react";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAddWatchlist } from "@/hookAPI/SUPABASE/publicSchema/watchlist/useAddWatchlist";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

const AddWatchListButton = () => {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [privacy, setPrivacy] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const { mutate: addWatchlistMutate, isPending: isAddWatchlistPending } =
    useAddWatchlist();

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
        toast.warning(
          "Tipe file tidak didukung! Gunakan JPG, JPEG, WEBP, atau PNG."
        );
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
      toast.error("Gagal memotong gambar!");
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
    setPrivacy(null);
    setName("");
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    // Validasi: name tidak boleh kosong
    if (!name.trim()) {
      toast.warning("Nama watchlist tidak boleh kosong!");
      return;
    }

    // Validasi: privacy harus dipilih
    if (!privacy) {
      toast.warning("Silakan pilih privasi watchlist!");
      return;
    }

    let pictureUrl = null;

    if (croppedImageBlob) {
      try {
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.webp`;

        const { data, error } = await supabase.storage
          .from("watchlist-image")
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
        } = supabase.storage.from("watchlist-image").getPublicUrl(data.path);

        pictureUrl = publicUrl;
      } catch (error) {
        toast.error("Terjadi kesalahan saat upload gambar!");
        return;
      }
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      is_public: privacy === "Public",
      picture_path: pictureUrl,
    };

    addWatchlistMutate(payload, {
      onSuccess: () => {
        toast.success("Watchlist berhasil ditambahkan!");
        handleCloseDialog();
      },
      onError: (error) => {
        toast.error(
          "Nama watchlist sudah digunakan. Silakan gunakan nama lain."
        );
      },
    });
  };

  return (
    <>
      <Button
        className="flex items-center gap-1 w-fit bg-[#7B61FF] hover:bg-[#7B61FF]/80 -mb-[25px]"
        onClick={() => setOpen(true)}
      >
        Watchlist Baru <Plus />
      </Button>

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
            {showCropper ? "Crop Gambar" : "Tambahkan Watchlist"}
          </DialogTitle>

          {showCropper ? (
            <ImageCropper
              imageSrc={imageSrc}
              onCropComplete={handleCropComplete}
              onCancel={handleCancelCrop}
            />
          ) : (
            <div className="flex   gap-2">
              {/* INI KIRI */}
              <div className="flex flex-col gap-2  w-full ">
                <label
                  className={`${fonts.satoshi.className} text-sm text-gray-300`}
                >
                  Gambar Watchlist
                </label>

                {croppedImage ? (
                  <div className="relative w-full max-w-[200px] aspect-[27/38] rounded-lg overflow-hidden bg-[#0D0D0D] group">
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
                    className="w-full max-w-[200px] aspect-[27/38] rounded-lg border-2 border-dashed border-gray-600 hover:border-[#7B61FF] bg-[#0D0D0D] hover:bg-[#1A1A1A] cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Upload size={20} className="text-gray-400" />
                    <p
                      className={`${fonts.satoshi.className} text-sm text-gray-400 text-center px-4`}
                    >
                      Klik untuk upload gambar
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

              {/* INI KANAN */}
              <div className="flex flex-col gap-2 w-full ">
                <div className="flex gap-1 flex-col justify-center">
                  <label
                    className={`${fonts.satoshi.className} text-sm text-gray-300`}
                  >
                    Nama
                  </label>
                  <Input
                    placeholder="Nama watchlist"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex gap-1 flex-col justify-center">
                  <label
                    className={`${fonts.satoshi.className} text-sm text-gray-300`}
                  >
                    Deskripsi
                  </label>
                  <Textarea
                    placeholder="Deskripsi watchlist (opsional)"
                    className="w-full resize-y min-h-10 dark-scrollbar"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex gap-1 flex-col justify-center">
                  <label
                    className={`${fonts.satoshi.className} text-sm text-gray-300`}
                  >
                    Privasi
                  </label>

                  <DropdownPrivacyButton
                    value={privacy}
                    onChange={setPrivacy}
                  />
                </div>
              </div>
            </div>
          )}

          {!showCropper && (
            <DialogFooter className="flex flex-col gap-2 pt-4 w-full">
              <Button
                className="w-fit bg-[#7B61FF] hover:bg-[#7B61FF]/80"
                onClick={handleSubmit}
                disabled={isAddWatchlistPending}
              >
                {isAddWatchlistPending ? "Menambahkan..." : "Tambah"}
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

export default AddWatchListButton;
