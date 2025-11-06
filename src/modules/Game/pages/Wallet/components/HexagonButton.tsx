import { useMemo, useState, ReactNode } from "react";
import { motion } from "framer-motion";

// Hexagon button types
export type HexagonDirection = "left" | "center" | "right";

export interface HexagonButtonProps {
  icon: ReactNode;
  onClick: () => void;
  direction?: HexagonDirection;
  width?: number;
  tooltip?: string;
}

// Helper function to generate hexagon clipPath based on direction
const getHexagonClipPath = (size: number, direction: HexagonDirection): string => {
  const offset = size;
  switch (direction) {
    case "left":
      return `polygon(${offset}px 0, 100% 0, calc(100% - ${offset}px) 50%, 100% 100%, ${offset}px 100%, 0 50%)`;
    case "right":
      return `polygon(0 0, calc(100% - ${offset}px) 0, 100% 50%, calc(100% - ${offset}px) 100%, 0 100%, ${offset}px 50%)`;
    case "center":
    default:
      return `polygon(${offset}px 0, calc(100% - ${offset}px) 0, 100% 50%, calc(100% - ${offset}px) 100%, ${offset}px 100%, 0px 50%)`;
  }
};

// Reusable Hexagon Button Component
export const HexagonButton: React.FC<HexagonButtonProps> = ({ icon, onClick, direction = "center", width = 320, tooltip }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const layers = useMemo(() => [
    { width: width, height: 64, offset: 32, bg: isHovered ? "bg-cyan-400" : "bg-gray-600" },
    { width: width - 8, height: 60, offset: 30, bg: "bg-gray-800" },
    { width: width - 16, height: 56, offset: 28, bg: isHovered ? "bg-cyan-200" : "bg-white/30" },
    { width: width - 24, height: 52, offset: 26, bg: "bg-gray-800" },
  ], [isHovered]);

  const getOffsetClass = (direction: HexagonDirection) => {
    if (direction === "left") return "-left-[1px]";
    if (direction === "right") return "left-[1px]";
    return "";
  };

  const buildNestedLayers = (remainingLayers: typeof layers, depth: number = 0): ReactNode => {
    if (remainingLayers.length === 0) {
      return <div className="flex items-center justify-center">{icon}</div>;
    }

    const [currentLayer, ...rest] = remainingLayers;
    const offsetClass = depth >= 0 ? getOffsetClass(direction) : "";

    return (
      <motion.div
        className={`relative ${offsetClass} flex flex-col items-center justify-center text-white ${currentLayer.bg}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: `${currentLayer.width}px`,
          height: `${currentLayer.height}px`,
          clipPath: getHexagonClipPath(currentLayer.offset, direction),
        }}
      >
        {buildNestedLayers(rest, depth + 1)}
      </motion.div>
    );
  };

  return (
    <div
      className="relative transition-all duration-300 flex flex-col items-center justify-center"
      style={{
        filter: isHovered
          ? "drop-shadow(0 0 12px rgba(34, 211, 238, 1))"
          : "drop-shadow(0 0 12px rgba(34, 211, 238, 0))"
      }}
    >
      <motion.div className={`absolute border -top-12 text-sm z-20 p-2 rounded-md  transition-all duration-300
        ${isHovered
          ? "border-white/20 bg-gray-800 text-white"
          : "border-white/0 bg-gray-800/0 text-white/0"
        }`
      }>
        {tooltip}
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center text-white ${layers[0].bg}`}
        style={{
          width: `${layers[0].width}px`,
          height: `${layers[0].height}px`,
          clipPath: getHexagonClipPath(layers[0].offset, direction),
        }}
      >
        {buildNestedLayers(layers.slice(1))}
      </motion.button>
    </div>
  );
};

