import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PiMagicWand, PiSpinner } from "react-icons/pi";
import { ThemeAnalysis } from "../types";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";

interface AnalysisStepProps {
    analysis: ThemeAnalysis;
    onBack: () => void;
    onConfirm: (editedAnalysis: ThemeAnalysis) => void;
    isGeneratingPrompts: boolean;
}

export const AnalysisStep = ({
    analysis,
    onBack,
    onConfirm,
    isGeneratingPrompts,
}: AnalysisStepProps) => {
    const [editedAnalysis, setEditedAnalysis] = useState<ThemeAnalysis>(analysis);

    useEffect(() => {
        setEditedAnalysis(analysis);
    }, [analysis]);

    const handleFieldChange = (field: keyof ThemeAnalysis, value: string | number) => {
        setEditedAnalysis((prev) => ({ ...prev, [field]: value }));
    };

    const handleMaxTileDecrease = () => {
        const currentValue = editedAnalysis.maxTile;
        if (currentValue > 2) {
            handleFieldChange("maxTile", currentValue / 2);
        }
    };

    const handleMaxTileIncrease = () => {
        const currentValue = editedAnalysis.maxTile;
        if (currentValue < 65536) {
            handleFieldChange("maxTile", currentValue * 2);
        }
    };

    const handleConfirm = () => {
        onConfirm(editedAnalysis);
    };
    return (
        <motion.div
            key="analysis"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 rounded-lg flex flex-col h-full max-h-full"
        >
            {/* Sticky Header */}
            <div className="flex-shrink-0 p-8 pb-6 sticky top-0 z-10">
                <h2 className="text-2xl font-semibold">Review Theme Analysis</h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-8 pb-8">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Theme Topic</label>
                        <input
                            type="text"
                            value={editedAnalysis.themeTopic}
                            onChange={(e) => handleFieldChange("themeTopic", e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-lg font-semibold text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Maximum Tile Value</label>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleMaxTileDecrease}
                                disabled={editedAnalysis.maxTile <= 2}
                                className="flex-shrink-0 w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-none text-white font-bold text-xl rounded-lg transition-all flex items-center justify-center"
                            >
                                <AiOutlineDoubleLeft />
                            </button>
                            <div className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-lg font-semibold text-white text-center">
                                {editedAnalysis.maxTile.toLocaleString()}
                            </div>
                            <button
                                type="button"
                                onClick={handleMaxTileIncrease}
                                disabled={editedAnalysis.maxTile >= 65536}
                                className="flex-shrink-0 w-10 h-10 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-none text-white font-bold text-xl rounded-lg transition-all flex items-center justify-center"
                            >
                                <AiOutlineDoubleRight />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Theme Style</label>
                        <input
                            type="text"
                            value={editedAnalysis.themeStyle}
                            onChange={(e) => handleFieldChange("themeStyle", e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Description</label>
                        <textarea
                            value={editedAnalysis.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            rows={4}
                            className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Buttons in main section */}
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={onBack}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isGeneratingPrompts}
                            className="flex-1 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-none text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            {isGeneratingPrompts ? (
                                <>
                                    <PiSpinner className="animate-spin text-xl" />
                                    Generating Prompts...
                                </>
                            ) : (
                                <>
                                    <PiMagicWand className="text-xl" />
                                    Generate Prompts
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

