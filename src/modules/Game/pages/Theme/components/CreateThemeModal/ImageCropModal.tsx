import React, { useState, useRef, useCallback } from "react";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ModalHeader } from "../../../../../common/components/ModalHeader";

// Helper function for centering the crop (moved from the main component)
const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) => {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
};

interface ImageCropModalProps {
  src: string;
  onApply: (file: File) => void;
  onCancel: () => void;
  tileValue: number;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  src,
  onApply,
  onCancel,
  tileValue,
}) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, 1)); // Use 1:1 aspect ratio for tiles
    },
    []
  );

  const handleCropComplete = useCallback((pixelCrop: PixelCrop) => {
    setCompletedCrop(pixelCrop);
  }, []);

  // Apply crop when user clicks "Apply"
  const applyCurrentCrop = useCallback(() => {
    if (imgRef.current && completedCrop) {
      const image = imgRef.current;
      const canvas = document.createElement("canvas");

      // Calculate actual scaled dimensions
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Use the actual rotation and scaling
        const rotateRads = (rotate * Math.PI) / 180;

        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotateRads);
        ctx.scale(scale, scale);

        ctx.drawImage(
          image,
          (completedCrop.x / scale) * scaleX,
          (completedCrop.y / scale) * scaleY,
          (completedCrop.width / scale) * scaleX,
          (completedCrop.height / scale) * scaleY,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );

        ctx.restore();

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File(
              [blob],
              `tile-${tileValue}.png`,
              {
                type: "image/png",
              }
            );

            onApply(file);
          }
        }, "image/png");
      }
    }
  }, [completedCrop, rotate, scale, onApply, tileValue]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
      <div className="bg-gray-800 border border-white/10 rounded-lg p-6 max-w-3xl w-full">
        <ModalHeader title="Crop Image" onClose={onCancel} />

        <div className="mb-4 flex flex-col items-center">
          <div className="mb-4 flex gap-4 text-white">
            <div>
              <label htmlFor="scale-input">Scale: </label>
              <input
                id="scale-input"
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 rounded-md p-1 w-20"
              />
            </div>
            <div>
              <label htmlFor="rotate-input">Rotate: </label>
              <input
                id="rotate-input"
                type="number"
                value={rotate}
                onChange={(e) =>
                  setRotate(
                    Math.min(
                      180,
                      Math.max(-180, Number(e.target.value))
                    )
                  )
                }
                className="bg-gray-700 border border-gray-600 rounded-md p-1 w-20"
              />
            </div>
          </div>

          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={1} // 1:1 aspect ratio for tiles
            className="max-h-[60vh] bg-gray-900"
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
              }}
              onLoad={onImageLoad}
              className="max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={applyCurrentCrop}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            disabled={
              !completedCrop?.width || !completedCrop?.height
            }
          >
            Apply
          </button>
        </div>

        {/* Hidden canvas for preview if needed */}
        <canvas
          ref={previewCanvasRef}
          style={{
            display: "none",
            width: completedCrop?.width ?? 0,
            height: completedCrop?.height ?? 0,
          }}
        />
      </div>
    </div>
  );
}; 