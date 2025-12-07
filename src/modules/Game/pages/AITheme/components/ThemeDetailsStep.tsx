import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PiPencil } from "react-icons/pi";
import { ThemeDetails, TilePrompt } from "../types";
import { EditTileImageModal } from "./EditTileImageModal";
import { Select } from "../../../../../components";

interface ThemeDetailsStepProps {
    themeDetails: ThemeDetails;
    generatedImages: Record<number, string>;
    tilePrompts: TilePrompt[];
    getTileValues: () => number[];
    onBack: () => void;
    onNext: (details: ThemeDetails) => void;
    onUpdateDetails: (details: ThemeDetails) => void;
    onUpdatePrompt: (value: number, field: keyof TilePrompt, newValue: string) => void;
    onRegenerateTile: (tileValue: number) => Promise<void>;
    isRegenerating: boolean;
}

export const ThemeDetailsStep = ({
    themeDetails,
    generatedImages,
    tilePrompts,
    getTileValues,
    onBack,
    onNext,
    onUpdateDetails,
    onUpdatePrompt,
    onRegenerateTile,
    isRegenerating,
}: ThemeDetailsStepProps) => {
    const [localDetails, setLocalDetails] = useState<ThemeDetails>(themeDetails);
    const [selectedTile, setSelectedTile] = useState<TilePrompt | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLocalDetails(themeDetails);
    }, [themeDetails]);

    const handleVisibilityChange = (visibility: "private" | "public" | "premium") => {
        const updated = {
            ...localDetails,
            visibility,
            price: visibility === "premium" ? localDetails.price || 0 : undefined,
        };
        setLocalDetails(updated);
        onUpdateDetails(updated);
    };

    const handlePriceChange = (price: number) => {
        const updated = {
            ...localDetails,
            price,
        };
        setLocalDetails(updated);
        onUpdateDetails(updated);
    };

    const handleNumberDisplayChange = (updates: Partial<ThemeDetails["numberDisplay"]>) => {
        const updated = {
            ...localDetails,
            numberDisplay: {
                ...localDetails.numberDisplay,
                ...updates,
            },
        };
        setLocalDetails(updated);
        onUpdateDetails(updated);
    };

    const handleNext = () => {
        onNext(localDetails);
    };

    const handleTileClick = (tile: TilePrompt) => {
        setSelectedTile(tile);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTile(null);
    };

    const getPositionStyles = () => {
        const numberDisplay = localDetails.numberDisplay;
        const baseStyles = {
            position: "absolute" as const,
            color: numberDisplay.color,
            fontSize: `${numberDisplay.size}px`,
            fontWeight: "bold" as const,
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        };

        switch (numberDisplay.position) {
            case "top-left":
                return { ...baseStyles, top: "8px", left: "8px" };
            case "top-right":
                return { ...baseStyles, top: "8px", right: "8px" };
            case "bottom-left":
                return { ...baseStyles, bottom: "8px", left: "8px" };
            case "bottom-right":
                return { ...baseStyles, bottom: "8px", right: "8px" };
            case "center":
            default:
                return {
                    ...baseStyles,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                };
        }
    };

    return (
        <motion.div
            key="themeDetails"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 rounded-lg flex flex-col h-full max-h-full"
        >
            {/* Header */}
            <div className="flex-shrink-0 px-8 pt-6 pb-0 sticky top-0 z-10">
                <h2 className="text-2xl font-semibold mb-2">Theme Settings</h2>
                <p className="text-gray-400 text-sm">
                    Configure visibility, pricing, and number display options for your theme.
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-8 pt-6">
                <div className="flex flex-col gap-6">
                    {/* Visibility Section */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-medium">Visibility</label>
                        <div className="flex gap-4">
                            {(["private", "public", "premium"] as const).map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="visibility"
                                        value={option}
                                        checked={localDetails.visibility === option}
                                        onChange={() => handleVisibilityChange(option)}
                                        className="w-4 h-4 accent-cyan-500"
                                    />
                                    <span className="text-white capitalize">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Section (only for premium) */}
                    {localDetails.visibility === "premium" && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-400 font-medium">
                                Price (USD)
                            </label>
                            <input
                                type="number"
                                value={localDetails.price || 0}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "") {
                                        handlePriceChange(0);
                                    } else {
                                        const parsed = parseFloat(value);
                                        if (!isNaN(parsed) && parsed >= 0) {
                                            handlePriceChange(parsed);
                                        }
                                    }
                                }}
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                                placeholder="Enter price"
                            />
                            <p className="text-xs text-cyan-300/70">
                                Note: A 10% platform fee will be applied to all sales. Your net
                                earnings will be ${((localDetails.price || 0) * 0.9).toFixed(2)} per
                                sale.
                            </p>
                        </div>
                    )}

                    {/* Number Display Section */}
                    <div className="flex flex-col gap-4 bg-gray-700/30 border border-cyan-400/20 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="show-numbers"
                                checked={localDetails.numberDisplay.show}
                                onChange={(e) =>
                                    handleNumberDisplayChange({ show: e.target.checked })
                                }
                                className="w-4 h-4 accent-cyan-500"
                            />
                            <label htmlFor="show-numbers" className="text-sm text-gray-400 font-medium cursor-pointer">
                                Show numbers on tiles
                            </label>
                        </div>

                        {localDetails.numberDisplay.show && (
                            <div className="flex flex-col gap-4 pl-6 border-l-2 border-cyan-400/20">
                                {/* Position */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400">Number Position</label>
                                    <Select
                                        value={localDetails.numberDisplay.position}
                                        onChange={(value) =>
                                            handleNumberDisplayChange({
                                                position: value as ThemeDetails["numberDisplay"]["position"],
                                            })
                                        }
                                        options={[
                                            { value: "center", label: "Center" },
                                            { value: "top-left", label: "Top Left" },
                                            { value: "top-right", label: "Top Right" },
                                            { value: "bottom-left", label: "Bottom Left" },
                                            { value: "bottom-right", label: "Bottom Right" },
                                        ]}
                                        className="w-full"
                                    />
                                </div>

                                {/* Size */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400">
                                        Number Size: {localDetails.numberDisplay.size}px
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">10px</span>
                                        <input
                                            type="range"
                                            min="10"
                                            max="96"
                                            step="1"
                                            value={localDetails.numberDisplay.size}
                                            onChange={(e) =>
                                                handleNumberDisplayChange({
                                                    size: parseInt(e.target.value),
                                                })
                                            }
                                            className="flex-1 accent-cyan-500"
                                        />
                                        <span className="text-xs text-gray-500">96px</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleNumberDisplayChange({
                                                    size: Math.max(10, localDetails.numberDisplay.size - 1),
                                                })
                                            }
                                            className="w-8 h-8 flex items-center justify-center text-cyan-100 rounded transition-colors border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10"
                                        >
                                            -
                                        </button>
                                        <span className="text-cyan-200 min-w-[50px] text-center">
                                            {localDetails.numberDisplay.size}px
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleNumberDisplayChange({
                                                    size: Math.min(96, localDetails.numberDisplay.size + 1),
                                                })
                                            }
                                            className="w-8 h-8 flex items-center justify-center text-cyan-100 rounded transition-colors border border-cyan-400/30 hover:border-cyan-400/50 hover:bg-cyan-400/10"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Color */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm text-gray-400">Number Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={localDetails.numberDisplay.color}
                                            onChange={(e) =>
                                                handleNumberDisplayChange({ color: e.target.value })
                                            }
                                            className="h-10 w-16 rounded border border-cyan-400/30 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={localDetails.numberDisplay.color}
                                            onChange={(e) =>
                                                handleNumberDisplayChange({ color: e.target.value })
                                            }
                                            className="flex-1 px-4 py-2 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Preview Section */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400 font-medium">Preview</label>
                        <p className="text-xs text-gray-500 mb-2">Click on any image to edit it</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                            {getTileValues().map((value) => {
                                const tile = tilePrompts.find((t) => t.value === value);
                                const imageUrl = generatedImages[value];
                                const numberDisplay = localDetails.numberDisplay;

                                if (!imageUrl || !tile) return null;

                                return (
                                    <div
                                        key={value}
                                        className="bg-gray-800/50 rounded-lg p-2 border border-gray-700 cursor-pointer hover:border-cyan-500 transition-colors"
                                        onClick={() => handleTileClick(tile)}
                                    >
                                        <div className="aspect-square bg-gray-800 rounded-lg relative overflow-hidden group">
                                            <img
                                                src={imageUrl}
                                                alt={`Tile ${value}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {numberDisplay.show && (
                                                <span style={getPositionStyles()}>{value}</span>
                                            )}
                                            {/* Edit Icon Overlay */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <PiPencil className="text-2xl text-white" />
                                            </div>
                                        </div>
                                        <p className="text-center text-xs font-semibold mt-1">
                                            {tile.title || `Tile ${value}`}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-8 py-4 sticky bottom-0">
                <div className="flex items-center gap-3">
                    <div className="flex-1" />
                    <button
                        onClick={onBack}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            <EditTileImageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                tile={selectedTile}
                currentImageUrl={selectedTile ? generatedImages[selectedTile.value] : undefined}
                onUpdatePrompt={onUpdatePrompt}
                onRegenerate={onRegenerateTile}
                isRegenerating={isRegenerating}
            />
        </motion.div>
    );
};

