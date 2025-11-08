import React, { useState } from "react";
import { GameItem } from "../../../../../../types";
import { AnimatePresence, motion } from "framer-motion";

interface ItemButtonProps {
  item: GameItem;
  onClick: () => void;
  loading?: boolean;
  direction?: "top" | "right" | "left";
}

export const ItemButton: React.FC<ItemButtonProps> = ({
  item,
  onClick,
  loading,
  direction = "top"
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const getExternalClipPath = {
    "top": `polygon(0 0, 100% 0, calc(100% - 20px) 100%, 20px 100%)`,
    "right": `polygon(20px 0, 100% 0, 100% 100%, 0 100%)`,
    "left": `polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)`,
  };
  const getInternalClipPath = {
    "top": `polygon(0 0, 100% 0, calc(100% - 16.65px) 100%, 16.65px 100%)`,
    "right": `polygon(16.65px 0, 100% 0, 100% 100%, 0 100%)`,
    "left": `polygon(0 0, calc(100% - 16.65px) 0, 100% 100%, 0 100%)`,
  };
  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      style={{
        filter: isHovered ? "drop-shadow(0 0 12px rgba(34, 211, 238, 1))" : "drop-shadow(0 0 12px rgba(34, 211, 238, 0))",
      }}
    >
      <motion.button
        className={`relative flex items-center justify-center transition-all duration-200 min-w-20 cursor-none 
          ${isHovered ? "bg-cyan-600" : "bg-gray-600"}`
        }
        style={{
          clipPath: getExternalClipPath[direction],
          width: 160,
          height: 60,
        }}
        onClick={onClick}
        disabled={item.quantity <= 0}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 rounded-lg"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          className={`${isHovered ? "bg-cyan-800" : "bg-gray-800"} relative flex items-center gap-2 justify-center transition-all duration-200 cursor-none`}
          style={{
            clipPath: getInternalClipPath[direction],
            width: 144.6,
            height: 50,
          }}
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <img src={item.icon} alt={item.id} />
          </div>
          <div className="text-sm font-bold rounded-md">
            {item.quantity}
          </div>
        </motion.button>
      </motion.button>
    </motion.div>
  );
};
