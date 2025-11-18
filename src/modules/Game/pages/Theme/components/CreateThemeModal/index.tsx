import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeFormData } from "../../types";
import { ThemeBasicInfo } from "./ThemeBasicInfo";
import { ThemeNumberDisplay } from "./ThemeNumberDisplay";
import { ThemeTileImages } from "./ThemeTileImages";
import { ImageCropModal } from "./ImageCropModal";
import { ModalHeader } from "../../../../../common/components/ModalHeader";
import { ModalFooter } from "../../../../../common/components/ModalFooter";
import { useAuthContext } from "../../../../../../context/AuthContext";

interface CreateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (themeData: ThemeFormData) => void;
}

const tileValues = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536,
];

export const CreateThemeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateThemeModalProps) => {
  const { handleCreateTheme } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<
    "private" | "public" | "premium"
  >("private");
  const [price, setPrice] = useState<number>(0);
  const [tileImages, setTileImages] = useState<ThemeFormData["tileImages"]>(
    tileValues.map((value) => ({
      value,
      image: null,
      description: "",
    }))
  );
  const [numberDisplay, setNumberDisplay] = useState<
    ThemeFormData["numberDisplay"]
  >({
    show: true,
    position: "center",
    color: "#ffffff",
    size: 16,
  });
  const [error, setError] = useState<string | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>(
    tileValues.map(() => null)
  );

  const [cropMode, setCropMode] = useState<number | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const [uploadStatus, setUploadStatus] = useState<{
    status: string;
    progress?: number;
    message: string;
  } | null>(null);

  const handleImageChange = (index: number, file: File) => {
    setCropSrc(URL.createObjectURL(file));
    setCropMode(index);
  };

  const handleApplyCrop = (croppedImage: File, index: number) => {
    const newTileImages = [...tileImages];
    newTileImages[index].image = croppedImage;
    setTileImages(newTileImages);

    setCropMode(null);
    setCropSrc(null);
  };

  const handleCropCancel = () => {
    setCropMode(null);
    setCropSrc(null);
  };

  const handleDescriptionChange = (index: number, description: string) => {
    const newTileImages = [...tileImages];
    newTileImages[index].description = description;
    setTileImages(newTileImages);
  };

  const handleImageCancel = (index: number) => {
    const newTileImages = [...tileImages];
    newTileImages[index].image = null;
    setTileImages(newTileImages);

    // Clear the file input value so the same file can be selected again
    const input = fileInputRefs.current[index];
    if (input) {
      input.value = "";
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVisibility("private");
    setPrice(0);
    setTileImages(
      tileValues.map((value) => ({
        value,
        image: null,
        description: "",
      }))
    );
    setNumberDisplay({
      show: true,
      position: "center",
      color: "#ffffff",
      size: 16,
    });
    setError(null);
    setUploadStatus(null);

    // Clear file inputs
    fileInputRefs.current.forEach((input) => {
      if (input) {
        input.value = "";
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setUploadStatus(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("visibility", visibility);

      if (visibility === "premium") {
        formData.append("price", price.toString());
      }

      // Add number display preferences
      formData.append("numberDisplay", JSON.stringify(numberDisplay));

      // Add tile images and descriptions
      tileImages.forEach((tile) => {
        if (tile.image) {
          formData.append(`tileImage_${tile.value}`, tile.image);
          formData.append(
            `tileDescription_${tile.value}`,
            tile.description || ""
          );
        }
      });

      // Send to backend with progress updates
      await handleCreateTheme(formData, (status) => {
        setUploadStatus(status);
      });

      // Call the onSubmit callback provided by the parent component
      onSubmit({
        title,
        description,
        visibility,
        tileImages,
        numberDisplay,
        ...(visibility === "premium" ? { price } : {}),
      });

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Error creating theme:", error);
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to create theme. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="create-theme-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#020c16]/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="border border-cyan-400/25 bg-gradient-to-b from-[#042035]/95 via-[#020f1c]/95 to-[#01070d]/95 shadow-[0_20px_50px_rgba(0,255,255,0.2)] rounded-2xl w-full relative max-w-7xl max-h-[90vh]"
          >
            <ModalHeader title="Create New Theme" />

            <div className="flex flex-col gap-6 bg-cyan-500/5 p-6 h-[calc(90vh-186px)] overflow-y-auto">
              {/* Theme Basic Info */}
              <ThemeBasicInfo
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                visibility={visibility}
                setVisibility={setVisibility}
                price={price}
                setPrice={setPrice}
              />

              {/* Number Display Options */}
              <ThemeNumberDisplay
                numberDisplay={numberDisplay}
                setNumberDisplay={setNumberDisplay}
              />

              {/* Tile Images */}
              <ThemeTileImages
                tileImages={tileImages}
                fileInputRefs={fileInputRefs}
                onImageChange={handleImageChange}
                onDescriptionChange={handleDescriptionChange}
                numberDisplay={numberDisplay}
                onImageCancel={handleImageCancel}
              />

              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded-md">
                  <p className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </p>
                </div>
              )}
            </div>
            {/* Submit Button */}
            <ModalFooter
              onCancel={onClose}
              onSubmit={handleSubmit}
              submitDisabled={
                isSubmitting ||
                !title.trim() ||
                tileImages
                  .filter((tile) => tile.value <= 4096)
                  .some((tile) => !tile.image)
              }
              submitLabel={isSubmitting ? "Creating..." : "Create Theme"}
            />
          </motion.div>
          {uploadStatus && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-30 bottom-0">
              <div className="border border-cyan-400/25 bg-gradient-to-b from-[#042035]/95 via-[#020f1c]/95 to-[#01070d]/95 shadow-[0_20px_50px_rgba(0,255,255,0.2)] rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-cyan-100 mb-4">
                  Uploading Theme...
                </h3>
                <p className="text-cyan-200/80 mb-4">{uploadStatus.message}</p>
                <div className="w-full bg-gray-700/50 rounded-full h-4 mb-2">
                  <div
                    className="bg-cyan-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadStatus.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-right text-cyan-300/70 text-sm">
                  {uploadStatus.progress || 0}%
                </p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Image Crop Modal */}
      {cropMode !== null && cropSrc && (
        <ImageCropModal
          key="image-crop-modal"
          src={cropSrc}
          onApply={(file) => handleApplyCrop(file, cropMode)}
          onCancel={handleCropCancel}
          tileValue={tileImages[cropMode]?.value}
        />
      )}
    </AnimatePresence>
  );
};
