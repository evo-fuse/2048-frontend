import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PiMagicWand, PiSpinner, PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";
import { TilePrompt } from "../types";
import { TilePromptEditor } from "./TilePromptEditor";
import { useAuthContext } from "../../../../../context";

interface PromptsStepProps {
    tilePrompts: TilePrompt[];
    onBack: () => void;
    onGenerateImages: () => void;
    onUpdatePrompt: (value: number, field: keyof TilePrompt, newValue: string) => void;
    isGeneratingImages: boolean;
}

export const PromptsStep = ({
    tilePrompts,
    onBack,
    onGenerateImages,
    onUpdatePrompt,
    isGeneratingImages,
}: PromptsStepProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { user, handleUpdateUser, setUser } = useAuthContext();

    const IMAGE_COST = 1; // 1 credit per image
    const totalCost = tilePrompts.length * IMAGE_COST;
    const userCredits = user?.ATCredits || 0;
    const hasEnoughCredits = userCredits >= totalCost;

    useEffect(() => {
        if (tilePrompts.length > 0) {
            setCurrentIndex(0);
        }
    }, [tilePrompts]);

    const currentTile = tilePrompts[currentIndex];

    const handleGenerateWithCredits = async () => {
        if (!hasEnoughCredits || isGeneratingImages) return;

        // Deduct credits before proceeding to theme details step
        const data = await handleUpdateUser({ ATCredits: userCredits - totalCost });
        setUser(data);

        // Navigate to theme details step (which will then proceed to generation)
        onGenerateImages();
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : tilePrompts.length - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev < tilePrompts.length - 1 ? prev + 1 : 0));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <motion.div
            key="prompts"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 rounded-lg flex flex-col h-full max-h-full"
        >
            {/* Sticky Header */}
            <div className="flex-shrink-0 px-8 pt-6 pb-0 sticky top-0 z-10">
                <h2 className="text-2xl font-semibold mb-2">Edit Tile Prompts</h2>
                <p className="text-gray-400 text-sm">
                    Review and edit the image generation prompts for each tile. You can customize the
                    prompts to better match your vision.
                </p>
            </div>

            {/* Carousel Content */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {/* Slide Container */}
                <div className="flex-1 overflow-hidden min-h-0 px-8 py-6">
                    <AnimatePresence mode="wait">
                        {currentTile && (
                            <motion.div
                                key={currentTile.value}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <TilePromptEditor
                                    tile={currentTile}
                                    onUpdate={onUpdatePrompt}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer with Navigation, Status, and Action Buttons */}
            <div className="flex-shrink-0 px-8 pb-4 sticky bottom-0">
                <div className="flex items-center gap-3">
                    {/* Navigation Arrows */}
                    {tilePrompts.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="w-8 h-8 bg-transparent hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-all flex-shrink-0"
                                aria-label="Previous tile"
                            >
                                <PiCaretLeft className="text-lg" />
                            </button>

                            {/* Carousel Indicators */}
                            <div className="flex items-center gap-1.5 px-2">
                                {tilePrompts.map((tile, index) => (
                                    <button
                                        key={tile.value}
                                        onClick={() => goToSlide(index)}
                                        className={`transition-all rounded-full ${index === currentIndex
                                            ? "w-6 h-1.5 bg-cyan-500"
                                            : "w-1.5 h-1.5 bg-gray-600 hover:bg-gray-500"
                                            }`}
                                        aria-label={`Go to tile ${tile.value}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={goToNext}
                                className="w-8 h-8 bg-transparent hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-all flex-shrink-0"
                                aria-label="Next tile"
                            >
                                <PiCaretRight className="text-lg" />
                            </button>
                        </>
                    )}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Minimal Action Buttons */}
                    <button
                        onClick={onBack}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleGenerateWithCredits}
                        disabled={isGeneratingImages || !hasEnoughCredits}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-none text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
                    >
                        {isGeneratingImages ? (
                            <>
                                <PiSpinner className="animate-spin text-sm" />
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <PiMagicWand className="text-sm" />
                                <span>Generate</span>
                                <div className="flex items-center gap-1">
                                    <GrMoney />
                                    <span>{totalCost}</span>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

