import React from "react";
import { FormSection } from "../../../../../common/components/FormSection";
import { ThemeFormData } from "../../types";
import { TileImageCard } from "../TileImageCard";
import { IoIosClose } from "react-icons/io";
interface ThemeTileImagesProps {
  tileImages: ThemeFormData["tileImages"];
  fileInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onImageChange: (index: number, file: File) => void;
  onDescriptionChange: (index: number, description: string) => void;
  numberDisplay: ThemeFormData["numberDisplay"];
  onImageCancel: (index: number) => void;
}

export const ThemeTileImages: React.FC<ThemeTileImagesProps> = ({
  tileImages,
  fileInputRefs,
  onImageChange,
  onDescriptionChange,
  numberDisplay,
  onImageCancel,
}) => {
  return (
    <FormSection label="Tile Images">
      <div className="bg-yellow-800/30 border border-yellow-600/50 rounded p-3 mb-4 text-yellow-200 text-sm">
        <strong>Warning:</strong>
        <br /> Do not upload copyrighted, violent or sexual images.
        Images must not show excessive amounts of skin or cleavage, or
        focus unnecessarily on body parts such as abs, buttocks, or
        chest.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tileImages.map((tile, index) => (
          <div key={tile.value} className="relative mb-4 flex items-center gap-4">
            {tile.image && (
              <div className="absolute top-14 right-6 flex items-center gap-2">
                <button
                  type="button"
                  className="p-0 rounded-full bg-gray-500/50 hover:bg-gray-300/50 transition-colors duration-300 z-20"
                  onClick={() => onImageCancel(index)}
                >
                  <IoIosClose size={32} color="white" />
                </button>
              </div>
            )}
            <TileImageCard
              tile={tile}
              index={index}
              inputRef={(el) => {
                fileInputRefs.current[index] = el;
              }}
              onImageChange={(file) => onImageChange(index, file)}
              onDescriptionChange={(desc) => onDescriptionChange(index, desc)}
              numberDisplay={numberDisplay}
            />
          </div>
        ))}
      </div>
    </FormSection>
  );
}; 