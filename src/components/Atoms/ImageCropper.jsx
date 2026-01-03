"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { fonts } from "@/fonts/fonts";
import { ZoomIn, ZoomOut, Move } from "lucide-react";

const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspect = 27 / 38,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = () => {
    onCropComplete(croppedAreaPixels);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Info */}
      <div
        className={`${fonts.satoshi.className} flex items-center gap-2 text-sm text-gray-400 bg-[#1A1A1A] p-3 rounded-lg`}
      >
        <Move size={16} className="text-[#7B61FF]" />
        <span>
          Drag gambar untuk menggeser posisi, gunakan slider atau scroll mouse
          untuk zoom
        </span>
      </div>

      {/* Cropper Area */}
      <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
          zoomWithScroll={true}
          showGrid={true}
          style={{
            containerStyle: {
              borderRadius: "8px",
            },
            cropAreaStyle: {
              border: "2px solid #7B61FF",
            },
          }}
        />
      </div>

      {/* Zoom Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className={`${fonts.satoshi.className} text-sm text-gray-300`}>
            Zoom: {zoom.toFixed(1)}x
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-2 rounded-lg bg-[#1A1A1A] hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
        <Slider
          value={[zoom]}
          min={1}
          max={3}
          step={0.1}
          onValueChange={(value) => setZoom(value[0])}
          className="w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end mt-2">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="hover:bg-[#2F2F2F]"
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          className="bg-[#7B61FF] hover:bg-[#7B61FF]/80"
        >
          Gunakan Foto
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
