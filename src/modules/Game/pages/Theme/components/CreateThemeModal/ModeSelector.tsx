import { motion } from "framer-motion";

interface ModeSelectorProps {
  mode: "manual" | "ai";
  onModeChange: (mode: "manual" | "ai") => void;
}

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <div className="mb-6 flex items-center justify-center gap-2 bg-gray-900/50 p-1 rounded-lg border border-white/10 relative">
      <button
        onClick={() => onModeChange("manual")}
        className="flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-200 relative z-10"
      >
        {mode === "manual" && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-blue-600 rounded-md shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <div className={`flex items-center justify-center gap-2 relative z-10 ${
          mode === "manual" ? "text-white" : "text-gray-400"
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Manual Mode</span>
        </div>
      </button>
      <button
        onClick={() => onModeChange("ai")}
        className="flex-1 px-6 py-3 rounded-md font-semibold transition-all duration-200 relative z-10"
      >
        {mode === "ai" && (
          <motion.div
            layoutId="activeBackground"
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md shadow-lg"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <div className={`flex items-center justify-center gap-2 relative z-10 ${
          mode === "ai" ? "text-white" : "text-gray-400"
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          <span>AI Mode</span>
        </div>
      </button>
    </div>
  );
};

