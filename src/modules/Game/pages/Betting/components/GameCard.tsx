import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { cardVariants } from "../constants";
import type { GameCardProps } from "../types";

export const GameCard = memo(({ game, isSelected, onSelect }: GameCardProps) => {
    const Icon = game.icon;

    const handleClick = useCallback(() => {
        onSelect(game.id);
    }, [game.id, onSelect]);

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-3 cursor-none"
            onClick={handleClick}
        >
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div
                    className={`relative w-64 h-64 bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-300 flex items-center justify-center shadow-2xl rounded-2xl border-2 ${isSelected
                            ? "border-cyan-700"
                            : "border-white/20 hover:border-cyan-500/50"
                        }`}
                >
                    <Icon className="text-cyan-500" size={96} />
                </div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {game.name}
            </h3>
        </motion.div>
    );
});

GameCard.displayName = "GameCard";

