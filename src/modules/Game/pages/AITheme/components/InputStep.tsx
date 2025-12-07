import { motion } from "framer-motion";
import { PiMagicWand, PiSpinner } from "react-icons/pi";

interface InputStepProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export const InputStep = ({ prompt, onPromptChange, onAnalyze, isAnalyzing }: InputStepProps) => {
    return (
        <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 rounded-lg p-8 border border-gray-700"
        >
            <h2 className="text-2xl font-semibold mb-4">Enter Your Theme Prompt</h2>
            <p className="text-gray-400 mb-6">
                Describe the theme you want for your 2048 game. Be as detailed as possible!
            </p>
            <textarea
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="e.g., A space exploration theme with planets, stars, and galaxies. Realistic style with vibrant colors. Maximum tile should be 4096."
                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
            />
            <button
                onClick={onAnalyze}
                disabled={isAnalyzing || !prompt.trim()}
                className="mt-6 w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-none text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
                {isAnalyzing ? (
                    <>
                        <PiSpinner className="animate-spin text-xl" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <PiMagicWand className="text-xl" />
                        Analyze Prompt
                    </>
                )}
            </button>
        </motion.div>
    );
};

