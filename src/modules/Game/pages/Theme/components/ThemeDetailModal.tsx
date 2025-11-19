import React, { useState, useEffect } from "react";
import Modal from "../../../../../components/Modal";
import { Theme, TileImg } from "../../../../../types";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoImageOutline } from "react-icons/io5";

interface ThemeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme | "Basic" | null;
  onApplyTheme: (theme: Theme | "Basic") => Promise<void>;
  isSelected: boolean;
}

// Preview all tiles in the theme
const previewTiles = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536];

export const ThemeDetailModal: React.FC<ThemeDetailModalProps> = ({
  isOpen,
  onClose,
  theme,
  onApplyTheme,
  isSelected,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const isBasic = theme === "Basic";

  // Preload images when modal opens
  useEffect(() => {
    if (!isOpen || isBasic || !theme) return;

    // Reset loaded images when modal opens
    setLoadedImages({});

    // Preload all tile images
    previewTiles.forEach((value) => {
      const tileImg: TileImg = theme[value as keyof Theme] as TileImg;
      if (tileImg && tileImg.sm) {
        const img = new Image();
        img.src = tileImg.sm;

        img.onload = () => {
          setLoadedImages((prev) => ({ ...prev, [value]: true }));
        };

        img.onerror = () => {
          setLoadedImages((prev) => ({ ...prev, [value]: false }));
        };
      }
    });
  }, [isOpen, theme, isBasic]);

  if (!theme) return null;

  const handleApplyTheme = async () => {
    if (!theme) return;

    setIsLoading(true);
    try {
      await onApplyTheme(theme);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isBasic ? "Basic Theme" : theme.title}
      maxWidth="max-w-4xl"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="p-6 flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Theme preview */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white">Theme Preview</h3>

              <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-8 p-2">
                {isBasic ? (
                  // Basic theme preview
                  previewTiles.map((value, index) => (
                    <motion.div
                      key={value}
                      className="w-16 h-20 flex flex-col items-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div
                        className="min-w-16 min-h-16 rounded-md flex items-center justify-center text-lg font-bold"
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#EC9050"
                        }}
                      >
                        {value}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{value}</span>
                    </motion.div>
                  ))
                ) : (
                  // Custom theme preview - show all tiles
                  previewTiles.map((value, index) => {
                    const tileImg: TileImg = theme[value as keyof Theme] as TileImg;
                    const isImageLoaded = loadedImages[value] === true;
                    const hasImage = tileImg && tileImg.sm;

                    return (
                      <motion.div
                        key={value}
                        className="w-16 h-20 flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="relative w-16 h-16">
                          {hasImage ? (
                            <>
                              {!isImageLoaded && (
                                <div className="absolute inset-0 w-full h-full rounded-md bg-white/10 animate-pulse" />
                              )}
                              <img
                                src={tileImg.sm}
                                alt={`Tile ${value}`}
                                className={`w-full h-full rounded-md object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
                                  }`}
                                onLoad={() => {
                                  setLoadedImages((prev) => ({ ...prev, [value]: true }));
                                }}
                                onError={() => {
                                  setLoadedImages((prev) => ({ ...prev, [value]: false }));
                                }}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full min-h-full aspect-square rounded-md bg-gradient-to-br from-cyan-900/30 via-cyan-800/20 to-cyan-900/30 border-2 border-dashed border-cyan-400/30 flex flex-col items-center justify-center gap-1 2xs:gap-1.5 relative overflow-hidden">
                              <motion.div
                                className="absolute inset-0"
                                style={{
                                  background: "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.15) 50%, transparent 100%)",
                                  transform: "translateX(-100%)",
                                }}
                                animate={{
                                  transform: ["translateX(-100%)", "translateX(200%)"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              <IoImageOutline className="text-cyan-300/50 z-10" size={20} />
                              <span className="text-[8px] 2xs:text-[10px] xs:text-xs text-cyan-300/60 font-medium z-10">
                                No image
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 mt-1">{value}</span>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>

            {/* Theme details */}
            {!isBasic && (
              <motion.div
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Creator</p>
                    <p className="text-white truncate">{theme.creator_id ? theme.creator_id.substring(0, 10) + '...' : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Visibility</p>
                    <p className="text-white capitalize">{theme.visibility}</p>
                  </div>
                  {theme.price && (
                    <div>
                      <p className="text-gray-400">Price</p>
                      <p className="text-white">{theme.price} $</p>
                    </div>
                  )}
                  {theme.owned !== undefined && (
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-white">{theme.owned ? 'Owned' : 'Not Owned'}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              className="flex justify-end gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <motion.button
                onClick={handleApplyTheme}
                disabled={isLoading || isSelected}
                className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${isSelected
                  ? "bg-green-700 text-white cursor-none"
                  : isLoading
                    ? "bg-cyan-700 text-white cursor-none"
                    : "bg-cyan-600 text-white hover:bg-cyan-500"
                  }`}
                whileHover={!isLoading && !isSelected ? { scale: 1.05 } : {}}
                whileTap={!isLoading && !isSelected ? { scale: 0.95 } : {}}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Applying...
                  </>
                ) : isSelected ? (
                  "Current Theme"
                ) : (
                  "Apply Theme"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};
