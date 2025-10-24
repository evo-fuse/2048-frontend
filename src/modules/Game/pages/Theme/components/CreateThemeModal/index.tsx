import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeFormData } from "../../types";
import { ImageCropModal } from "./ImageCropModal";
import { ModalHeader } from "../../../../../common/components/ModalHeader";
import { ModalFooter } from "../../../../../common/components/ModalFooter";
import { useAuthContext } from "../../../../../../context/AuthContext";
import { ModeSelector } from "./ModeSelector";
import { ManualModeContent } from "./ManualModeContent";
import { AIModeContent } from "./AIModeContent";
import { AISuggestionsReview } from "./AISuggestionsReview";
import { AIImageGeneration } from "./AIImageGeneration";
import { AIImageReview } from "./AIImageReview";

interface CreateThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (themeData: ThemeFormData) => void;
}

const tileValues = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768,
  65536,
];

interface TileSuggestion {
  value: number;
  description: string;
  imagePrompt: string;
}

export const CreateThemeModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateThemeModalProps) => {
  const { handleCreateTheme } = useAuthContext();
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [aiStep, setAiStep] = useState<1 | 2 | 3 | 4>(1); // 1: prompt entry, 2: review suggestions, 3: image generation, 4: final review
  const [aiSuggestions, setAiSuggestions] = useState<TileSuggestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [imageStyle, setImageStyle] = useState<"cinematic" | "creative" | "dynamic" | "fashion">("cinematic");
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

  const handleAiNext = () => {
    setAiStep(2);
  };

  const handleAiBack = () => {
    if (aiStep === 2) {
      setAiStep(1);
    } else if (aiStep === 3) {
      setAiStep(2);
    } else if (aiStep === 4) {
      setAiStep(3);
    }
  };

  const handleAiAccept = (suggestions: TileSuggestion[], aiTitle: string, aiDescription: string) => {
    setAiSuggestions(suggestions);
    
    // Auto-populate title and description from AI
    if (aiTitle) {
      setTitle(aiTitle);
    }
    if (aiDescription) {
      setDescription(aiDescription);
    }
    
    // Store suggestions in tile images state for submission
    const updatedTileImages = tileImages.map((tile) => {
      const suggestion = suggestions.find((s) => s.value === tile.value);
      return {
        ...tile,
        description: suggestion?.description || tile.description,
      };
    });
    setTileImages(updatedTileImages);
    // Move to next step (image generation)
    setAiStep(3);
  };

  const handleImageGenerationComplete = (suggestionsWithImages: TileSuggestion[]) => {
    setAiSuggestions(suggestionsWithImages);
    // Move to final review step
    setAiStep(4);
  };

  const resetForm = () => {
    setMode("manual");
    setAiStep(1);
    setAiSuggestions([]);
    setTitle("");
    setDescription("");
    setAiPrompt("");
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
      formData.append("mode", mode);

      if (visibility === "premium") {
        formData.append("price", price.toString());
      }

      // Add number display preferences
      formData.append("numberDisplay", JSON.stringify(numberDisplay));

      if (mode === "ai") {
        // AI Mode: Send prompt and suggestions for AI generation
        formData.append("aiPrompt", aiPrompt);
        formData.append("aiSuggestions", JSON.stringify(aiSuggestions));
      } else {
        // Manual Mode: Send tile images and descriptions
        tileImages.forEach((tile) => {
          if (tile.image) {
            formData.append(`tileImage_${tile.value}`, tile.image);
            formData.append(
              `tileDescription_${tile.value}`,
              tile.description || ""
            );
          }
        });
      }

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 border border-white/10 rounded-lg px-6 pb-6 w-full relative max-w-7xl h-[90vh] max-h-[90vh] overflow-y-auto"
          >
            <ModalHeader title="Create New Theme" onClose={onClose} />

            {/* Mode Selector */}
            <ModeSelector 
              mode={mode} 
              onModeChange={(newMode) => {
                setMode(newMode);
                setAiStep(1); // Reset AI step when switching modes
              }} 
            />

            <div className="space-y-6">
              {mode === "manual" ? (
                <ManualModeContent
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  visibility={visibility}
                  setVisibility={setVisibility}
                  price={price}
                  setPrice={setPrice}
                  numberDisplay={numberDisplay}
                  setNumberDisplay={setNumberDisplay}
                  tileImages={tileImages}
                  fileInputRefs={fileInputRefs}
                  onImageChange={handleImageChange}
                  onDescriptionChange={handleDescriptionChange}
                  onImageCancel={handleImageCancel}
                />
              ) : aiStep === 1 ? (
                <AIModeContent
                  aiPrompt={aiPrompt}
                  setAiPrompt={setAiPrompt}
                  imageStyle={imageStyle}
                  setImageStyle={setImageStyle}
                  onNext={handleAiNext}
                />
              ) : aiStep === 2 ? (
                <AISuggestionsReview
                  prompt={aiPrompt}
                  imageStyle={imageStyle}
                  onBack={handleAiBack}
                  onAccept={handleAiAccept}
                />
              ) : aiStep === 3 ? (
                <AIImageGeneration
                  suggestions={aiSuggestions}
                  onBack={handleAiBack}
                  onNext={handleImageGenerationComplete}
                />
              ) : (
                <AIImageReview
                  suggestions={aiSuggestions}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  visibility={visibility}
                  setVisibility={setVisibility}
                  price={price}
                  setPrice={setPrice}
                  numberDisplay={numberDisplay}
                  setNumberDisplay={setNumberDisplay}
                  onBack={handleAiBack}
                />
              )}

              {/* Submit Button - Only show for manual mode or AI step 4 */}
              {(mode === "manual" || (mode === "ai" && aiStep === 4)) && (
                <ModalFooter
                  onCancel={onClose}
                  onSubmit={handleSubmit}
                  submitDisabled={
                    isSubmitting ||
                    !title.trim() ||
                    (mode === "manual" &&
                      tileImages
                        .filter((tile) => tile.value <= 4096)
                        .some((tile) => !tile.image))
                  }
                  submitLabel={
                    isSubmitting
                      ? mode === "ai"
                        ? "Generating..."
                        : "Creating..."
                      : mode === "ai"
                      ? "Generate with AI"
                      : "Create Theme"
                  }
                />
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md">
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
          </motion.div>
          {uploadStatus && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-30 bottom-0">
              <div className="bg-gray-800 border border-white/20 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Uploading Theme...
                </h3>
                <p className="text-gray-300 mb-4">{uploadStatus.message}</p>
                <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadStatus.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-right text-gray-400 text-sm">
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
          src={cropSrc}
          onApply={(file) => handleApplyCrop(file, cropMode)}
          onCancel={handleCropCancel}
          tileValue={tileImages[cropMode]?.value}
        />
      )}
    </AnimatePresence>
  );
};
