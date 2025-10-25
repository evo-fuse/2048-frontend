import { FC } from 'react';
import { FaExchangeAlt, FaHammer } from 'react-icons/fa';
import { GiUpgrade } from 'react-icons/gi';
import { Item, useGameContext } from '../../context/GameContext';

export interface ItemBarProps {
    onBreak?: () => void;
    onUpgrade?: () => void;
    onSwap?: () => void;
}

const ItemBar: FC<ItemBarProps> = ({
    onBreak,
    onUpgrade,
    onSwap,
}) => {
    const { item } = useGameContext();
    return (
        <div className="flex flex-row justify-center items-center gap-4 p-4 bg-tile2 rounded-lg w-full">
            <button
                onClick={onBreak}
                className={`flex flex-1 flex-col items-center gap-1.5 py-3 px-2 ${item !== Item.BREAK ? 'opacity-50' : ''}`}
            >
                <FaHammer size={28} />
            </button>

            <button
                onClick={onUpgrade}
                className={`flex flex-1 flex-col items-center gap-1.5 py-3 px-2 ${item !== Item.UPGRADE ? 'opacity-50' : ''}`}
            >
                <GiUpgrade size={28} />
            </button>

            <button
                onClick={onSwap}
                className={`flex flex-1 flex-col items-center gap-1.5 py-3 px-2 ${item !== Item.SWAP ? 'opacity-50' : ''}`}
            >
                <FaExchangeAlt size={28} />
            </button>
        </div>
    );
};

export default ItemBar;
