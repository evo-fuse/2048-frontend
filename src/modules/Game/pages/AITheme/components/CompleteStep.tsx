import { useState } from "react";
import { motion } from "framer-motion";
import { IoCheckmarkCircle } from "react-icons/io5";
import { PiSpinner } from "react-icons/pi";
import { TilePrompt, ThemeDetails } from "../types";

interface CompleteStepProps {
    tilePrompts: TilePrompt[];
    generatedImages: Record<number, string>;
    themeDetails: ThemeDetails;
    onBack: () => void;
    onReset: () => void;
    onSave: (onProgress: (status: { status: string; progress?: number; message: string }) => void) => Promise<void>;
}

export const CompleteStep = ({
    tilePrompts,
    generatedImages,
    themeDetails,
    onBack,
    onReset,
    onSave,
}: CompleteStepProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        status: string;
        progress?: number;
        message: string;
    } | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setUploadStatus(null);
        try {
            await onSave((status) => {
                setUploadStatus(status);
            });
        } catch (error) {
            console.error("Error saving theme:", error);
            setUploadStatus({
                status: 'error',
                message: error instanceof Error ? error.message : 'Failed to save theme'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const getPositionStyles = () => {
        const numberDisplay = themeDetails.numberDisplay;
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
            key="complete"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-gray-800/50 rounded-lg flex flex-col h-full max-h-full relative"
        >
            {/* Sticky Header */}
            <div className="flex-shrink-0 px-8 py-6 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-4xl text-green-400" />
                    <h2 className="text-2xl font-semibold">Theme Generation Complete!</h2>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-8">
                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tilePrompts.map((tile) => {
                            const imageUrl = generatedImages[tile.value];

                            return (
                                <div
                                    key={tile.value}
                                    className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                                >
                                    <div className="aspect-square bg-gray-800 rounded-lg mb-2 overflow-hidden relative">
                                        {imageUrl ? (
                                            <>
                                                <img
                                                    src={imageUrl}
                                                    alt={`Tile ${tile.value}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {themeDetails.numberDisplay.show && (
                                                    <span style={getPositionStyles()}>
                                                        {tile.value}
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-center text-sm font-semibold">
                                            Tile {tile.value}: {tile.title}
                                        </p>
                                        <p className="text-center text-xs text-gray-400">{tile.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Upload Progress Overlay */}
            {uploadStatus && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-30">
                    <div className="border border-cyan-400/25 bg-gradient-to-b from-[#042035]/95 via-[#020f1c]/95 to-[#01070d]/95 shadow-[0_20px_50px_rgba(0,255,255,0.2)] rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-cyan-100 mb-4">
                            {uploadStatus.status === 'complete' ? 'Theme Saved!' : 'Saving Theme...'}
                        </h3>
                        <p className="text-cyan-200/80 mb-4">{uploadStatus.message}</p>
                        {uploadStatus.progress !== undefined && uploadStatus.status !== 'complete' && (
                            <>
                                <div className="w-full bg-gray-700/50 rounded-full h-4 mb-2">
                                    <div
                                        className="bg-cyan-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                                        style={{ width: `${uploadStatus.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-right text-cyan-300/70 text-sm">
                                    {uploadStatus.progress}%
                                </p>
                            </>
                        )}
                        {uploadStatus.status === 'complete' && (
                            <button
                                onClick={() => {
                                    setUploadStatus(null);
                                    onReset();
                                }}
                                className="w-full mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all"
                            >
                                Create Another Theme
                            </button>
                        )}
                        {uploadStatus.status === 'error' && (
                            <button
                                onClick={() => setUploadStatus(null)}
                                className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex-shrink-0 px-8 py-4 sticky bottom-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        Back
                    </button>
                    <div className="flex-1" />
                    <button
                        onClick={onReset}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        Create Another Theme
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-900/50 disabled:opacity-50 disabled:cursor-none text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <PiSpinner className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save Theme</span>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

