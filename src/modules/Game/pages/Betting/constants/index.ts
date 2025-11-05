import { LuDices, LuRabbit } from "react-icons/lu";
import { PATH } from "../../../../../const";
import type { GameConfig } from "../types";

export const GAMES: GameConfig[] = [
    {
        id: "block-bingo",
        name: "BlockBingo",
        icon: LuDices,
        path: PATH.BLOCK_BINGO,
    },
    {
        id: "animal-bingo",
        name: "Animal Bingo",
        icon: LuRabbit,
        path: PATH.ANIMAL_BINGO, // Update this when Animal Bingo path is available
    },
];

export const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
};

