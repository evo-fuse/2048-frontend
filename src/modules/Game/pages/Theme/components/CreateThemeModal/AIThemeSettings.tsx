import { ThemeFormData } from "../../types";
import { ThemeNumberDisplay } from "./ThemeNumberDisplay";

interface AIThemeSettingsProps {
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

export const AIThemeSettings = ({
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
}: AIThemeSettingsProps) => {
  return (
    <div className="space-y-6">
      {/* Theme Info Section */}
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
              Description (Optional)
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

      {/* Theme Settings */}
      <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Theme Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(
                  e.target.value as "private" | "public" | "premium"
                )
              }
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
              <option value="premium">Premium</option>
            </select>
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

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
      >
        ← Back to Review Suggestions
      </button>
    </div>
  );
};



