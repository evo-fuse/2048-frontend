import { useState } from "react";
import { generateTileImage } from "../../services";

interface ModelList {
  model: string;
  url?: string;
  description?: string;
}

const modelList: ModelList[] = [
  { model: "runware:101@1", description: "FULX Dev", url: "https://mim.runware.ai/r/67c1e3076ad38-768x1024.jpg" },
  { model: "bytedance:5@0", description: "Seedream4.0", url: "https://mim.runware.ai/r/68c075c402ec0-1024x1024.jpg" },
  { model: "google:4@1", description: "Nano Banana", url: "https://mim.runware.ai/r/68ae3dfdab44d-1024x1024.jpg" },
  { model: "runware:108@1", description: "Qwen-Image", url: "https://mim.runware.ai/r/6895d23d6a0f1-1024x1024.jpg" },
  { model: "runware:107@1", description: "FLUX.1 Krea", url: "https://mim.runware.ai/r/688903555b452-1024x1024.jpg" },
  { model: "bytedance:3@1", description: "Seedream3.0", url: "https://mim.runware.ai/r/687f99bad557c-3738x2103.jpg" },
  { model: "ideogram:4@1", description: "Ideogram3.0", url: "https://mim.runware.ai/r/689dab3b06b5e-1024x1024.jpg" },
  { model: "google:2@1", description: "Imagen 4.0 Preview", url: "https://mim.runware.ai/r/683e1248b59ca-1024x1024.jpg" },
  { model: "google:2@2", description: "Imagen 4.0 Ultra", url: "https://mim.runware.ai/r/683e116faa20e-1024x1024.jpg" },
  { model: "google:2@3", description: "Imagen 4.0 Fast", url: "https://mim.runware.ai/r/68776cf964334-1024x1024.jpg" },
  { model: "openai:1@1", description: "GPT Image 1", url: "https://mim.runware.ai/r/688b7c1e86b2e-1024x1024.jpg" },
  { model: "bfl:3@1", description: "FLUX.1 Kontext [pro]", url: "https://mim.runware.ai/r/68362f19ee011-896x1216.jpg" },
  { model: "bfl:2@2", description: "FLUX1.1 [pro] Ultra", url: "https://mim.runware.ai/r/683e1fd0c4cfc-1200x800.jpg" },
  { model: "runware:97@3", description: "HiDream-I1-Fast", url: "https://mim.runware.ai/r/6836e3761a35d-880x1168.jpg" },
  { model: "runware:97@2", description: "HiDream-I1-Dev", url: "https://mim.runware.ai/r/682f388d22a27-880x1168.jpg" },
  { model: "runware:97@1", description: "HiDream-I1-Full", url: "https://mim.runware.ai/r/682f3861e07f8-880x1168.jpg" },
  { model: "runware:100@1", description: "FLUX Schnell", url: "https://mim.runware.ai/r/67c1e2d8a5e3c-768x1024.jpg" },
  { model: "rundiffusion:130@100", description: "Juggernaut Pro Flux by RunDiffusion", url: "https://mim.runware.ai/r/67bf6a306dc46-1024x1365.jpg" },
  { model: "rundiffusion:110@101", description: "Juggernaut Lightning Flux by RunDiffusion", url: "https://mim.runware.ai/r/67bf6a1db1862-1024x1365.jpg" },
];

interface TileSuggestion {
  value: number;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface AIImageGenerationProps {
  suggestions: TileSuggestion[];
  onBack: () => void;
  onNext: (suggestionsWithImages: TileSuggestion[]) => void;
}

export const AIImageGeneration = ({
  suggestions,
  onBack,
  onNext,
}: AIImageGenerationProps) => {
  const [selectedModel, setSelectedModel] = useState<string>(modelList[0].model);
  const [concurrentImages, setConcurrentImages] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const handleImageError = (model: string) => {
    setImageLoadErrors(prev => new Set(prev).add(model));
  };

  const handleGenerateImages = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setGenerationProgress(0);

      const suggestionsWithImages: TileSuggestion[] = [...suggestions];
      const total = suggestions.length;
      let completed = 0;

      // Generate images in batches based on concurrentImages
      for (let i = 0; i < suggestions.length; i += concurrentImages) {
        const batch = suggestions.slice(i, i + concurrentImages);

        const imagePromises = batch.map(async (suggestion, batchIndex) => {
          try {
            const imageUrl = await generateTileImage({
              positivePrompt: suggestion.imagePrompt,
              model: selectedModel,
              numImages: 1,
              width: 512,
              height: 512,
            });

            const actualIndex = i + batchIndex;
            suggestionsWithImages[actualIndex] = {
              ...suggestionsWithImages[actualIndex],
              imageUrl,
            };

            completed++;
            setGenerationProgress(Math.round((completed / total) * 100));

            return imageUrl;
          } catch (error) {
            console.error(
              `Error generating image for tile ${suggestion.value}:`,
              error
            );
            throw error;
          }
        });

        await Promise.all(imagePromises);
      }

      onNext(suggestionsWithImages);
    } catch (err) {
      console.error("Error generating images:", err);
      setError(
        "Failed to generate some images. Please try again or adjust your settings."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-purple-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fillRule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-white mt-6 mb-2">
          Generating Images...
        </h3>
        <p className="text-gray-400 text-center max-w-md mb-6">
          Creating unique tile images with AI. This may take a few minutes...
        </p>
        <div className="w-full max-w-md">
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-300 text-sm">
            {generationProgress}% complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Generate Tile Images
            </h3>
            <p className="text-gray-400 text-sm">
              Select an AI model and configure image generation settings. We'll
              create unique images for all your tiles.
            </p>
          </div>
        </div>
      </div>

      {/* Model Selection Cards */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          AI Image Model
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Different models produce different artistic styles. Choose the one that best matches your theme.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pr-2">
          {modelList.map((model) => (
            <button
              key={model.model}
              onClick={() => setSelectedModel(model.model)}
              className={`
                group relative overflow-hidden rounded-lg transition-all duration-300
                ${selectedModel === model.model 
                  ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/50 scale-105' 
                  : 'ring-1 ring-white/10 hover:ring-purple-400 hover:scale-102'
                }
              `}
            >
              {/* Image Preview */}
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                {!imageLoadErrors.has(model.model) && model.url ? (
                  <img
                    src={model.url}
                    alt={model.description || model.model}
                    onError={() => handleImageError(model.model)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                
                {/* Selected Indicator */}
                {selectedModel === model.model && (
                  <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Model Info */}
              <div className="p-3 bg-gray-800/90 border-t border-white/10">
                <p className="text-sm font-medium text-white truncate">
                  {model.description || model.model}
                </p>
                <p className="text-xs text-gray-400 truncate mt-1">
                  {model.model}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Generation Settings
        </h3>
        <div className="space-y-6">
          {/* Concurrent Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Concurrent Image Generation
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setConcurrentImages(num)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${concurrentImages === num
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white ring-2 ring-purple-400 shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 ring-1 ring-white/10'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Higher concurrency means faster generation but may use more
              resources. Recommended: 3 images at a time.
            </p>
          </div>

          {/* Tiles Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tiles to Generate
            </label>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <span
                    key={suggestion.value}
                    className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-xs text-purple-300"
                  >
                    {suggestion.value}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Total: {suggestions.length} images will be generated
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleGenerateImages}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors"
        >
          Generate Images →
        </button>
      </div>
    </div>
  );
};

