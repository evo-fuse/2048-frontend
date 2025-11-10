import React, { useState, useEffect, useRef } from "react";
import { Theme } from "../../../../../types";
import { Ribbon } from "../../../../../components";
import { motion } from "framer-motion";
import { useAuthContext } from "../../../../../context";

interface ThemeItemProps {
  theme: Theme | "Basic";
  isSelected: boolean;
  onClick: () => void;
  onHover: (theme: Theme | "Basic" | null) => void;
}

export const ThemeItem: React.FC<ThemeItemProps> = ({
  theme,
  isSelected,
  onClick,
  onHover,
}) => {
  const isBasic = theme === "Basic";
  const { user } = useAuthContext();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset loading state when theme changes
  useEffect(() => {
    if (!isBasic) {
      setIsImageLoaded(false);
      // Check if image is already loaded (cached) after render
      const checkImageLoaded = () => {
        if (imgRef.current?.complete) {
          setIsImageLoaded(true);
        }
      };
      // Use requestAnimationFrame to check after render
      requestAnimationFrame(checkImageLoaded);
    }
  }, [theme, isBasic]);

  return (
    <div
      className="flex flex-col gap-2 items-center justify-center hover:opacity-90 transition-opacity"
      onClick={onClick}
      onMouseOver={() => onHover(theme)}
      onMouseOut={() => onHover(null)}
    >
      <motion.div
        className="relative"
        whileHover={{ y: [0, -5, 0] }}
        transition={{ duration: 0.3 }}
      >
        {isBasic ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-32 h-32 text-cyan-500 bg-white rounded-lg flex items-center justify-center text-6xl"
          >
            2
          </motion.div>
        ) : (
          <div className="relative w-32 h-32">
            {!isImageLoaded && (
              <div className="absolute inset-0 w-32 h-32 rounded-lg bg-white/10 animate-pulse" />
            )}
            <img
              ref={imgRef}
              src={theme[2].sm}
              alt={theme.title}
              className={`w-32 h-32 rounded-lg shadow-md shadow-black absolute inset-0 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          </div>
        )}
        {isSelected && <Ribbon />}
        {!isBasic && theme.creator_id === user?.address && (
          <div
            className="w-36 h-36 absolute flex flex-col items-end justify-end overflow-hidden"
            style={{
              top: -16,
              right: -8,
            }}
          >
            <div
              className={`relative z-20 w-36 h-4 rotate-0 bottom-2 right-0 bg-yellow-500 text-white text-xs text-center flex items-center justify-center`}
              style={{ clipPath: "polygon(0 0, 144px 0, 140px 100%, 4px 100%)" }}
            >
              Owned
            </div>
            <div
              className={`z-10 absolute bottom-6 left-0 min-w-[8px] min-h-[8px] bg-yellow-800`}
              style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
            />
            <div
              className={`z-10 absolute bottom-6 right-0 min-w-[8px] min-h-[8px] bg-yellow-800`}
              style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
            />
          </div>
        )}
      </motion.div>
      <span className="text-center">{isBasic ? "Basic" : theme.title}</span>
    </div>
  );
};
