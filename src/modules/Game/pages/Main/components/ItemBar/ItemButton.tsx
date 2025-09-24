import React from "react";
import { GameItem } from "../../../../../../types";
import { AnimatePresence, motion } from "framer-motion";

interface ItemButtonProps {
  item: GameItem;
  onClick: () => void;
  loading?: boolean;
}

export const ItemButton: React.FC<ItemButtonProps> = ({
  item,
  onClick,
  loading,
}) => {
  return (
    <motion.button
      className="bg-none hover:bg-white/10 relative flex items-center justify-center border-2 border-transparent rounded-lg p-2 transition-all duration-200 min-w-20 hover:border-white/30 cursor-none"
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
      <div className="w-10 h-10 flex items-center justify-center">
        <img src={item.icon} alt={item.id} />
      </div>
      <div className="text-sm font-bold rounded-md px-2 py-1">
        {item.quantity}
      </div>
    </motion.button>
  );
};
