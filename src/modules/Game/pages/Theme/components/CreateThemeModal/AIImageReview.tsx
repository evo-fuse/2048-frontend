import { ThemeFormData } from "../../types";
import { RadioGroup } from "../../../../../common/components/RadioGroup";
import { ThemeNumberDisplay } from "./ThemeNumberDisplay";

interface TileSuggestion {
  value: number;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
}

interface AIImageReviewProps {
  suggestions: TileSuggestion[];
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  visibility: "private" | "public" | "premium";
  setVisibility: (value: "private" | "public" | "premium") => void;
  price: number;
  setPrice: (value: number) => void;
  numberDisplay: ThemeFormData["numberDisplay"];
  setNumberDisplay: (value: ThemeFormData["numberDisplay"]) => void;
  onBack: () => void;
}

export const AIImageReview = ({
  suggestions,
  title,
  setTitle,
  description,
  setDescription,
  visibility,
  setVisibility,
  price,
  setPrice,
  numberDisplay,
  setNumberDisplay,
  onBack,
}: AIImageReviewProps) => {
  const visibilityOptions = [
    { value: "private", label: "Private" },
    { value: "public", label: "Public" },
    { value: "premium", label: "Premium" },
  ];

  return (
    <div className="space-y-6">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Review Generated Theme
            </h3>
            <p className="text-gray-400 text-sm">
              Review your generated tile images and configure final settings before publishing.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Information */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Theme Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Cosmic Adventure"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Additional theme description"
            />
          </div>
        </div>
      </div>

      {/* Generated Tiles Preview */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Generated Tiles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.value}
              className="bg-gray-800/50 border border-white/5 rounded-lg overflow-hidden"
            >
              {/* Tile Image */}
              <div className="aspect-square relative bg-gray-700">
                {suggestion.imageUrl ? (
                  <img
                    src={suggestion.imageUrl}
                    alt={`Tile ${suggestion.value}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-500"
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
                {/* Tile Value Badge */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 rounded text-xs font-bold text-white">
                  {suggestion.value}
                </div>
              </div>
              {/* Tile Description */}
              <div className="p-2">
                <p className="text-xs text-gray-300 line-clamp-2">
                  {suggestion.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Visibility & Access
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Who can use this theme?
            </label>
            <RadioGroup
              options={visibilityOptions}
              value={visibility}
              onChange={(value) =>
                setVisibility(value as "private" | "public" | "premium")
              }
            />
            <div className="mt-3 text-xs text-gray-500">
              {visibility === "private" && (
                <p>Only you can use this theme</p>
              )}
              {visibility === "public" && (
                <p>Anyone can use this theme for free</p>
              )}
              {visibility === "premium" && (
                <p>Users must pay tokens to use this theme</p>
              )}
            </div>
          </div>

          {visibility === "premium" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (tokens)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Number Display Options */}
      <ThemeNumberDisplay
        numberDisplay={numberDisplay}
        setNumberDisplay={setNumberDisplay}
      />

      {/* Action Button */}
      <button
        onClick={onBack}
        className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
      >
        ← Back to Image Generation
      </button>
    </div>
  );
};

