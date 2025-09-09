import React from "react";
import { FormSection } from "../../../../../common/components/FormSection";
import { Select } from "../../../../../../components";
import { ThemeFormData } from "../../types";

interface ThemeNumberDisplayProps {
  numberDisplay: ThemeFormData["numberDisplay"];
  setNumberDisplay: (numberDisplay: ThemeFormData["numberDisplay"]) => void;
}

export const ThemeNumberDisplay: React.FC<ThemeNumberDisplayProps> = ({
  numberDisplay,
  setNumberDisplay,
}) => {
  return (
    <FormSection label="Number Display">
      <div className="space-y-4 bg-gray-700 p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-numbers"
            checked={numberDisplay.show}
            onChange={(e) =>
              setNumberDisplay({ ...numberDisplay, show: e.target.checked })
            }
            className="bg-gray-700 border border-gray-600 rounded"
          />
          <label htmlFor="show-numbers" className="text-white">
            Show numbers on tiles
          </label>
        </div>

        {numberDisplay.show && (
          <>
            <div>
              <label className="block text-white mb-2">Number Position</label>
              <Select
                value={numberDisplay.position}
                onChange={(value) =>
                  setNumberDisplay({
                    ...numberDisplay,
                    position:
                      value as ThemeFormData["numberDisplay"]["position"],
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
            
            <div>
              <label className="block text-white mb-2">Number Size (px)</label>
              <div className="flex items-center space-x-3">
                <span className="text-white text-xs">10px</span>
                <div className="relative flex-grow h-6 flex items-center">
                  <div className="absolute w-full h-1 bg-gray-600 rounded"></div>
                  <input
                    type="range"
                    min="10"
                    max="96"
                    step="1"
                    value={numberDisplay.size}
                    onChange={(e) => {
                      const sizeValue = parseInt(e.target.value);
                      setNumberDisplay({
                        ...numberDisplay,
                        size: sizeValue,
                      });
                    }}
                    className="appearance-none absolute w-full h-1 bg-transparent"
                  />
                </div>
                <span className="text-white text-base">96px</span>
              </div>
              <div className="mt-2 flex justify-center items-center gap-3">
                <span className="text-gray-300">{numberDisplay.size}px</span>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    onClick={() =>
                      setNumberDisplay({
                        ...numberDisplay,
                        size: Math.max(10, numberDisplay.size - 1),
                      })
                    }
                  >
                    -
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                    onClick={() =>
                      setNumberDisplay({
                        ...numberDisplay,
                        size: Math.min(96, numberDisplay.size + 1),
                      })
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Number Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={numberDisplay.color}
                  onChange={(e) =>
                    setNumberDisplay({
                      ...numberDisplay,
                      color: e.target.value,
                    })
                  }
                  className="bg-gray-700 border border-gray-600 rounded h-10 w-10"
                />
                <input
                  type="text"
                  value={numberDisplay.color}
                  onChange={(e) =>
                    setNumberDisplay({
                      ...numberDisplay,
                      color: e.target.value,
                    })
                  }
                  className="bg-gray-600 text-white border border-gray-500 rounded-md p-2"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </FormSection>
  );
};
