import { Select } from "../../../../../../components/Select";

interface AIModeContentProps {
  aiPrompt: string;
  setAiPrompt: (value: string) => void;
  imageStyle: "cinematic" | "creative" | "dynamic" | "fashion";
  setImageStyle: (value: "cinematic" | "creative" | "dynamic" | "fashion") => void;
  onNext: () => void;
}

export const AIModeContent = ({
  aiPrompt,
  setAiPrompt,
  imageStyle,
  setImageStyle,
  onNext,
}: AIModeContentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Describe Your Theme
        </label>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Describe your theme in detail. For example:&#10;&#10;'Create a space-themed 2048 game with cosmic elements. The tiles should feature planets, stars, and galaxies with deep space colors (purples, blues, blacks), glowing effects and nebula backgrounds. Each tile should progressively show larger cosmic objects.'&#10;&#10;Be as specific as possible for best results!"
        />
        <p className="mt-2 text-xs text-gray-500">
          💡 Tip: The more detailed your description, the better the AI-generated tiles will match your vision
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Image Style
        </label>
        <Select
          options={[
            { value: "cinematic", label: "Cinematic" },
            { value: "creative", label: "Creative" },
            { value: "dynamic", label: "Dynamic" },
            { value: "fashion", label: "Fashion" },
          ]}
          value={imageStyle}
          onChange={(value) => setImageStyle(value as "cinematic" | "creative" | "dynamic" | "fashion")}
          placeholder="Select image style"
          className="w-full"
        />
        <p className="mt-2 text-xs text-gray-500">
          Choose the visual style for your AI-generated tiles
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!aiPrompt.trim()}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
      >
        Analyze with AI →
      </button>
    </div>
  );
};

