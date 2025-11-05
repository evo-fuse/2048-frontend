import type { IconType } from "react-icons";

export interface GameConfig {
    id: string;
    name: string;
    icon: IconType;
    path: string;
}

export interface GameCardProps {
    game: GameConfig;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

