import { useState, useEffect } from "react";
import { useGameContext } from "../../../../context";
import { Theme } from "../../../../../../types";

interface TileViewProps {
  value: number;
}

type TileViewTheme = Omit<
  Theme,
  | "description"
  | "owned"
  | "title"
  | "uuid"
  | "position"
  | "numberColor"
  | "numberSize"
  | "numberDisplay"
  | "visibility"
  | "price"
  | "creator_id"
>;

export const TileView: React.FC<TileViewProps> = ({ value }) => {
  const { selectedTheme } = useGameContext();
  const [isLargeImageLoaded, setIsLargeImageLoaded] = useState(false);

  // Move hooks before any conditional returns
  useEffect(() => {
    // Only load the image if we're not using the Basic theme and value is valid
    if (selectedTheme !== "Basic" && value <= 8192) {
      setIsLargeImageLoaded(false);
      const img = new Image();
      img.src = selectedTheme[value as keyof TileViewTheme]?.lg || "";
      img.onload = () => {
        setIsLargeImageLoaded(true);
      };
    }
  }, [selectedTheme, value]);

  // Return empty fragment after hooks are called
  if (selectedTheme === "Basic" || value > 8192) return <></>;

  return (
    <div className="min-w-[556px] max-w-min h-[794.5px] bg-black/20 rounded-lg border border-white/20 p-8">
      <div className="w-[512px] h-[512px] relative">
        {/* Small image (shown initially) */}
        <img
          src={selectedTheme[value as keyof TileViewTheme]?.sm}
          alt="tile"
          className={`w-[512px] h-[512px] absolute top-0 left-0 transition-opacity duration-300 ${
            isLargeImageLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{ objectFit: "contain" }}
        />

        {/* Large image (shown when loaded) */}
        <img
          src={selectedTheme[value as keyof TileViewTheme]?.lg}
          alt="tile"
          className={`w-[512px] h-[512px] absolute top-0 left-0 transition-opacity duration-300 ${
            isLargeImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="mt-8">
        <p className="text-white text-left text-lg border border-white/20 rounded-lg p-6 break-all">
          {selectedTheme[value as keyof TileViewTheme]?.description}
        </p>
      </div>
    </div>
  );
};
