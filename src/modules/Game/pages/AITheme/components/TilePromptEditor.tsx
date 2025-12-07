import { memo } from "react";
import { TilePrompt } from "../types";

interface TilePromptEditorProps {
    tile: TilePrompt;
    onUpdate: (value: number, field: keyof TilePrompt, newValue: string) => void;
}

export const TilePromptEditor = memo(({ tile, onUpdate }: TilePromptEditorProps) => {
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">
                    Tile {tile.value} - Title
                </label>
                <input
                    type="text"
                    value={tile.title}
                    onChange={(e) => onUpdate(tile.value, "title", e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400">Description</label>
                <input
                    type="text"
                    value={tile.description}
                    onChange={(e) => onUpdate(tile.value, "description", e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-base font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
            </div>
            <div className="flex flex-col gap-1 h-full">
                <label className="text-sm text-gray-400">
                    Image Generation Prompt
                </label>
                <textarea
                    value={tile.prompt}
                    onChange={(e) => onUpdate(tile.value, "prompt", e.target.value)}
                    rows={4}
                    className="w-full h-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    placeholder="Enter detailed image generation prompt..."
                />
            </div>
        </div>
    );
});

TilePromptEditor.displayName = "TilePromptEditor";

