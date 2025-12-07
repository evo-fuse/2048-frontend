import { useState, useEffect, useRef } from "react";
import Modal from "../../../../../components/Modal";
import { PiSpinner } from "react-icons/pi";
import { GrMoney } from "react-icons/gr";
import { IoCheckmarkCircle } from "react-icons/io5";
import { TilePrompt } from "../types";
import { useAuthContext } from "../../../../../context";

interface EditTileImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    tile: TilePrompt | null;
    currentImageUrl: string | undefined;
    onUpdatePrompt: (value: number, field: keyof TilePrompt, newValue: string) => void;
    onRegenerate: (tileValue: number) => Promise<void>;
    isRegenerating: boolean;
}

const REGENERATION_COST = 2;

export const EditTileImageModal = ({
    isOpen,
    onClose,
    tile,
    currentImageUrl,
    onUpdatePrompt,
    onRegenerate,
    isRegenerating,
}: EditTileImageModalProps) => {
    const { user, handleUpdateUser, setUser } = useAuthContext();
    const [editedPrompt, setEditedPrompt] = useState("");
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(currentImageUrl);
    const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
    const [isUpdatingDescription, setIsUpdatingDescription] = useState(false);
    const [showTitleCheck, setShowTitleCheck] = useState(false);
    const [showDescriptionCheck, setShowDescriptionCheck] = useState(false);
    const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const descriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const userCredits = user?.ATCredits || 0;
    const hasEnoughCredits = userCredits >= REGENERATION_COST;

    useEffect(() => {
        if (tile) {
            setEditedPrompt(tile.prompt);
            setEditedTitle(tile.title);
            setEditedDescription(tile.description);
        }
    }, [tile]);

    // Update displayed image when currentImageUrl changes (after regeneration)
    useEffect(() => {
        if (currentImageUrl) {
            setDisplayImageUrl(currentImageUrl);
        }
    }, [currentImageUrl]);

    // Show skeleton when regenerating starts
    useEffect(() => {
        if (isRegenerating) {
            setDisplayImageUrl(undefined);
        }
    }, [isRegenerating]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (titleTimeoutRef.current) {
                clearTimeout(titleTimeoutRef.current);
            }
            if (descriptionTimeoutRef.current) {
                clearTimeout(descriptionTimeoutRef.current);
            }
        };
    }, []);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!tile) return;
        const newValue = e.target.value;

        // Update local state immediately for responsive UI
        setEditedTitle(newValue);

        // Clear existing timeout
        if (titleTimeoutRef.current) {
            clearTimeout(titleTimeoutRef.current);
        }

        // Show spinner
        setIsUpdatingTitle(true);
        setShowTitleCheck(false);

        // Update parent state
        onUpdatePrompt(tile.value, "title", newValue);

        // After a brief delay, show check icon
        titleTimeoutRef.current = setTimeout(() => {
            setIsUpdatingTitle(false);
            setShowTitleCheck(true);
            // Hide check icon after 2 seconds
            setTimeout(() => {
                setShowTitleCheck(false);
            }, 2000);
        }, 300);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!tile) return;
        const newValue = e.target.value;

        // Update local state immediately for responsive UI
        setEditedDescription(newValue);

        // Clear existing timeout
        if (descriptionTimeoutRef.current) {
            clearTimeout(descriptionTimeoutRef.current);
        }

        // Show spinner
        setIsUpdatingDescription(true);
        setShowDescriptionCheck(false);

        // Update parent state
        onUpdatePrompt(tile.value, "description", newValue);

        // After a brief delay, show check icon
        descriptionTimeoutRef.current = setTimeout(() => {
            setIsUpdatingDescription(false);
            setShowDescriptionCheck(true);
            // Hide check icon after 2 seconds
            setTimeout(() => {
                setShowDescriptionCheck(false);
            }, 2000);
        }, 300);
    };

    const handleSave = async () => {
        if (!tile) return;
        onUpdatePrompt(tile.value, "prompt", editedPrompt);
        await onRegenerate(tile.value);
        const data = await handleUpdateUser({ ATCredits: userCredits - REGENERATION_COST });
        setUser(data);
    };

    if (!tile) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Image Prompt - Tile ${tile.value}`}
            maxWidth="max-w-4xl"
        >
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    {/* Current Image Display */}
                    <div className="flex-shrink-0 flex flex-col gap-1">
                        <label className="text-sm text-gray-400">Current Image</label>
                        <div className="w-80 h-80 bg-gray-800 rounded-lg overflow-hidden border border-cyan-400/30">
                            {isRegenerating ? (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800/50 animate-pulse">
                                    <PiSpinner className="animate-spin text-cyan-400 text-3xl" />
                                </div>
                            ) : displayImageUrl ? (
                                <img
                                    src={displayImageUrl}
                                    alt={`Tile ${tile.value}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No image
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inputs Section */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400">Title</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={handleTitleChange}
                                    className="w-full px-4 py-3 pr-10 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isUpdatingTitle ? (
                                        <PiSpinner className="animate-spin text-cyan-400 text-xl" />
                                    ) : showTitleCheck ? (
                                        <IoCheckmarkCircle className="text-green-400 text-xl" />
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400">Description</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editedDescription}
                                    onChange={handleDescriptionChange}
                                    className="w-full px-4 py-3 pr-10 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {isUpdatingDescription ? (
                                        <PiSpinner className="animate-spin text-cyan-400 text-xl" />
                                    ) : showDescriptionCheck ? (
                                        <IoCheckmarkCircle className="text-green-400 text-xl" />
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400">Image Generation Prompt</label>
                            <textarea
                                value={editedPrompt}
                                onChange={(e) => setEditedPrompt(e.target.value)}
                                rows={6}
                                className="w-full px-4 max-h-[140px] py-3 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
                                placeholder="Enter detailed image generation prompt..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isRegenerating || !hasEnoughCredits}
                        className="flex-1 bg-cyan-500/30 hover:bg-cyan-500/40 disabled:bg-cyan-900/50 disabled:opacity-50 disabled:cursor-none text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isRegenerating ? (
                            <>
                                <PiSpinner className="animate-spin" />
                                Regenerating...
                            </>
                        ) : (
                            <>
                                <span>Regenerate Image</span>
                                <div className="flex items-center gap-1">
                                    <GrMoney />
                                    <span>{REGENERATION_COST}</span>
                                </div>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

