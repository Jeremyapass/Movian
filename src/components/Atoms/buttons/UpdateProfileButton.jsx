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
import { getCroppedImg } from "@/lib/cropImage";
import { Pencil, Upload, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useUpdateAccountDetail } from "@/hookAPI/SUPABASE/publicSchema/account/useUpdateAccounDetail";
import { supabase } from "@/lib/supabaseClient";
import { useRoot } from "@/provider/rootProvider";
import { toast } from "react-toastify";

const UpdateProfileButton = () => {
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);

  const { getAccountDetailData } = useRoot();
  const { mutate: updateAccountMutate, isPending: isUpdatePending } =
    useUpdateAccountDetail();

  // Set initial values saat dialog dibuka
  useEffect(() => {
    if (open && getAccountDetailData) {
      setUsername(getAccountDetailData.username || "");
      setBio(getAccountDetailData.bio || "");
      // Set existing profile picture jika ada
      if (getAccountDetailData.profile_picture) {
        setCroppedImage(getAccountDetailData.profile_picture);
      }
    }
  }, [open, getAccountDetailData]);

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
        toast.warning("Ukuran file maksimal 800kb!");
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
    setUsername("");
    setBio("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    // Validasi: username tidak boleh kosong
    if (!username.trim()) {
      toast.warning("Username tidak boleh kosong!");
      return;
    }

    let profilePictureUrl = croppedImage; // Gunakan gambar yang sudah ada

    // Upload gambar baru jika ada perubahan
    if (croppedImageBlob) {
      try {
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.webp`;

        const { data, error } = await supabase.storage
          .from("profile-image")
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
        } = supabase.storage.from("profile-image").getPublicUrl(data.path);

        profilePictureUrl = publicUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Terjadi kesalahan saat upload gambar!");
        return;
      }
    }

    const payload = {
      username: username.trim(),
      bio: bio.trim(),
      profile_picture: profilePictureUrl,
    };

    updateAccountMutate(payload, {
      onSuccess: () => {
        handleCloseDialog();
      },
    });
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center text-[30px] font-semibold ${fonts.clash.className}`}
      >
        {getAccountDetailData?.username || "User"}
        <Button className="h-full" onClick={() => setOpen(true)}>
          <Pencil width={30} height={30} />
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
            {showCropper ? "Crop Gambar" : "Edit Profile"}
          </DialogTitle>

          {showCropper ? (
            <ImageCropper
              imageSrc={imageSrc}
              onCropComplete={handleCropComplete}
              onCancel={handleCancelCrop}
              aspect={1}
            />
          ) : (
            <div className="flex gap-2">
              {/* INI KIRI - PROFILE PICTURE */}
              <div className="flex flex-col gap-2 w-full">
                <label
                  className={`${fonts.satoshi.className} text-sm text-gray-300`}
                >
                  Profile Picture
                </label>

                {croppedImage ? (
                  <div className="relative w-full max-w-[200px] aspect-square rounded-lg overflow-hidden bg-[#0D0D0D] group">
                    <Image
                      src={croppedImage}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                      sizes="200px"
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
                    className="w-full max-w-[200px] aspect-square rounded-lg border-2 border-dashed border-gray-600 hover:border-[#7B61FF] bg-[#0D0D0D] hover:bg-[#1A1A1A] cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                  >
                    <Upload size={20} className="text-gray-400" />
                    <p
                      className={`${fonts.satoshi.className} text-sm text-gray-400 text-center px-4`}
                    >
                      Klik untuk upload gambar
                    </p>
                    <p
                      className={`${fonts.satoshi.className} text-xs text-gray-500`}
                    >
                      Max 800KB
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

              {/* INI KANAN - FORM */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-1 flex-col justify-center">
                  <label
                    className={`${fonts.satoshi.className} text-sm text-gray-300`}
                  >
                    Username
                  </label>
                  <Input
                    placeholder="Username"
                    className="w-full"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="flex gap-1 flex-col justify-center">
                  <label
                    className={`${fonts.satoshi.className} text-sm text-gray-300`}
                  >
                    Bio
                  </label>
                  <Textarea
                    placeholder="Bio (opsional)"
                    className="w-full resize-y min-h-10 dark-scrollbar"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
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
                disabled={isUpdatePending}
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

export default UpdateProfileButton;
