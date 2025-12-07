import { motion } from "framer-motion";
import { PiSpinner } from "react-icons/pi";
import { TilePrompt } from "../types";

interface GeneratingStepProps {
    tilePrompts: TilePrompt[];
    generatedImages: Record<number, string>;
    currentGeneratingTile: number | null;
    getTileValues: () => number[];
}

export const GeneratingStep = ({
    tilePrompts,
    generatedImages,
    currentGeneratingTile,
    getTileValues,
}: GeneratingStepProps) => {
    return (
        <motion.div
            key="generating"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 rounded-lg flex flex-col h-full max-h-full"
        >
            {/* Sticky Header */}
            <div className="flex-shrink-0 px-8 py-6 sticky top-0 z-10">
                <h2 className="text-2xl font-semibold mb-2">Generating Theme Images</h2>
                <p className="text-gray-400 text-sm">
                    Creating images for all tiles. This may take a few minutes...
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-8 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getTileValues().map((value) => {
                        const tile = tilePrompts.find((t) => t.value === value);
                        const imageUrl = generatedImages[value];
                        const isGenerating = currentGeneratingTile === value;

                        return (
                            <div
                                key={value}
                                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                            >
                                <div className="aspect-square bg-gray-800 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={`Tile ${value}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : isGenerating ? (
                                        <PiSpinner className="animate-spin text-cyan-400 text-3xl" />
                                    ) : (
                                        <span className="text-gray-500 text-sm">Pending...</span>
                                    )}
                                </div>
                                <p className="text-center text-sm font-semibold">
                                    Tile {value}
                                    {tile && `: ${tile.title}`}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

