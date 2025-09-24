import React, { ChangeEvent } from "react";
import { ThemeFormData } from "../types";

interface TileImageCardProps {
  tile: ThemeFormData["tileImages"][0];
  index: number;
  inputRef: (el: HTMLInputElement | null) => void;
  onImageChange: (file: File) => void;
  onDescriptionChange: (description: string) => void;
  numberDisplay: ThemeFormData["numberDisplay"];
}

export const TileImageCard: React.FC<TileImageCardProps> = ({
  tile,
  inputRef,
  onImageChange,
  onDescriptionChange,
  numberDisplay,
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold">
          {tile.value}: {tile.value < 8192 ? "(required)" : "(optional)"}
        </span>
      </div>

      <div className="mb-4">
        <div
          onClick={() =>
            document.getElementById(`file-input-${tile.value}`)?.click()
          }
          className="relative w-64 h-64 bg-gray-700 rounded-md flex items-center justify-center hover:bg-gray-600"
        >
          {tile.image ? (
            <div className="relative w-full h-full">
              <img
                src={URL.createObjectURL(tile.image)}
                alt={`Tile ${tile.value}`}
                className="max-h-full max-w-full object-contain"
              />
              {numberDisplay.show && (
                <div
                  className={`absolute font-bold ${
                    numberDisplay.position === "center"
                      ? "inset-0 flex items-center justify-center"
                      : numberDisplay.position === "top-left"
                      ? "top-2 left-2"
                      : numberDisplay.position === "top-right"
                      ? "top-2 right-2"
                      : numberDisplay.position === "bottom-left"
                      ? "bottom-2 left-2"
                      : "bottom-2 right-2"
                  }`}
                  style={{
                    color: numberDisplay.color,
                    fontSize: `${numberDisplay.size}px`,
                    lineHeight: `${numberDisplay.size}px`,
                  }}
                >
                  {tile.value}
                </div>
              )}
            </div>
          ) : (
            <span className="text-white/50">Click to upload image</span>
          )}
        </div>
        <input
          id={`file-input-${tile.value}`}
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div>
        <textarea
          value={tile.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2"
          placeholder="Image description"
        />
      </div>
    </div>
  );
};
