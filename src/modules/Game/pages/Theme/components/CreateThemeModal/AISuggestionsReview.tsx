import { useState, useEffect } from "react";
import { getThemeInfo } from "../../services";

interface TileSuggestion {
  value: number;
  description: string;
  imagePrompt: string;
}

interface AISuggestionsReviewProps {
  prompt: string;
  imageStyle: "cinematic" | "creative" | "dynamic" | "fashion";
  onBack: () => void;
  onAccept: (suggestions: TileSuggestion[], title: string, description: string) => void;
}

const tileValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];

export const AISuggestionsReview = ({
  prompt,
  imageStyle,
  onBack,
  onAccept,
}: AISuggestionsReviewProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [editedSuggestions, setEditedSuggestions] = useState<TileSuggestion[]>(
    []
  );
  const [themeTitle, setThemeTitle] = useState("");
  const [themeDescription, setThemeDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemeInfo = async () => {
      setIsAnalyzing(true);
      setError(null);

      try {
        const { status, parseData } = await getThemeInfo(prompt, imageStyle);

        if (status === 200 || status === 201) {
          // Extract title and description
          const title = parseData.title || "";
          const description = parseData.description || "";
          setThemeTitle(title);
          setThemeDescription(description);

          // Convert the tile data to TileSuggestion format
          const generatedSuggestions: TileSuggestion[] = tileValues.map((value) => ({
            value,
            description: parseData[value]?.description || `Tile ${value}`,
            imagePrompt: parseData[value]?.prompt || prompt,
          }));

          setEditedSuggestions(generatedSuggestions);
        } else {
          throw new Error("Failed to fetch theme information");
        }
      } catch (err) {
        console.error("Error fetching theme info:", err);
        setError("Failed to generate AI suggestions. Please try again.");
        // Fallback to empty suggestions
        const fallbackSuggestions = tileValues.map((value) => ({
          value,
          description: "",
          imagePrompt: "",
        }));
        setEditedSuggestions(fallbackSuggestions);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchThemeInfo();
  }, [prompt]);

  const handleDescriptionChange = (index: number, description: string) => {
    const updated = [...editedSuggestions];
    updated[index].description = description;
    setEditedSuggestions(updated);
  };

  const handleImagePromptChange = (index: number, imagePrompt: string) => {
    const updated = [...editedSuggestions];
    updated[index].imagePrompt = imagePrompt;
    setEditedSuggestions(updated);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mt-6 mb-2">
          Analyzing Your Theme...
        </h3>
        <p className="text-gray-400 text-center max-w-md">
          Our AI is processing your description and generating tile suggestions.
          This may take a moment...
        </p>
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
        <div className="flex items-start gap-3 mb-3">
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
              AI Generated Suggestions
            </h3>
            <p className="text-gray-400 text-sm">
              Review and edit the suggestions below. You can modify descriptions
              and image prompts for each tile.
            </p>
          </div>
        </div>

        {/* Original Prompt */}
        <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
          <p className="text-xs text-gray-500 mb-1">Your Original Prompt:</p>
          <p className="text-white text-sm">{prompt}</p>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Tile Descriptions & Image Prompts
        </h3>
        <div className="space-y-3">
          {editedSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.value}
              className="bg-gray-800/50 border border-white/5 rounded-lg p-4"
            >
              <div className="mb-3">
                <label className="block text-xs text-gray-400 mb-1">
                  Tile {suggestion.value} - Description
                </label>
                <input
                  type="text"
                  value={suggestion.description}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Description for tile ${suggestion.value}`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Image Generation Prompt
                </label>
                <textarea
                  value={suggestion.imagePrompt}
                  onChange={(e) =>
                    handleImagePromptChange(index, e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Detailed prompt for AI image generation"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
        >
          ← Back to Edit Prompt
        </button>
        <button
          onClick={() => onAccept(editedSuggestions, themeTitle, themeDescription)}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-colors"
        >
          Accept & Continue →
        </button>
      </div>
    </div>
  );
};

