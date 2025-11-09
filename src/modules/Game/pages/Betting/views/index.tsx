import React, { useState, useCallback, useMemo, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../../../const';
import { motion, AnimatePresence } from 'framer-motion';
import { LiaDiceSolid } from 'react-icons/lia';
import { TbMoneybag } from 'react-icons/tb';
import { HiArrowTrendingDown } from 'react-icons/hi2';
import { IoGameControllerOutline } from 'react-icons/io5';
import { IconType } from 'react-icons';
import { useAuthContext } from '../../../../../context';

type GameType = 'BlockBingo' | 'Animal Bingo';

const gamePath: Record<GameType, string> = {
    "BlockBingo": PATH.BLOCK_BINGO,
    "Animal Bingo": PATH.ANIMAL_BINGO,
};

// Responsive size classes
const RESPONSIVE_SIZES = {
    button: "w-10 h-10 3xs:w-11 3xs:h-11 2xs:w-12 2xs:h-12 xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16",
    icon: "text-lg 3xs:text-xl 2xs:text-xl xs:text-2xl sm:text-2xl md:text-2xl lg:text-3xl",
    gameIcon: "w-12 h-12 3xs:w-14 3xs:h-14 2xs:w-16 2xs:h-16 xs:w-16 xs:h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24",
    gameIconText: "text-2xl 3xs:text-3xl 2xs:text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl",
};

interface ActionButtonWithTooltipProps {
    icon: IconType;
    tooltip: string;
    onClick: () => void;
    isDisabled?: boolean;
    className?: string;
}

const ActionButtonWithTooltip: React.FC<ActionButtonWithTooltipProps> = ({
    icon: Icon,
    tooltip,
    onClick,
    isDisabled = false,
    className = "",
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipLeft, setTooltipLeft] = useState<number | undefined>(undefined);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (showTooltip && tooltipRef.current && buttonRef.current) {
            requestAnimationFrame(() => {
                if (tooltipRef.current && buttonRef.current) {
                    const tooltipWidth = tooltipRef.current.offsetWidth;
                    const buttonWidth = buttonRef.current.offsetWidth;
                    const leftOffset = -(tooltipWidth - buttonWidth) / 2;
                    setTooltipLeft(leftOffset);
                }
            });
        } else {
            setTooltipLeft(undefined);
        }
    }, [showTooltip]);

    return (
        <div className="relative">
            <AnimatePresence>
                {showTooltip && !isDisabled && (
                    <motion.div
                        className="absolute -top-12 z-50"
                        style={{
                            left: tooltipLeft !== undefined ? `${tooltipLeft}px` : '50%',
                            transform: tooltipLeft !== undefined ? 'none' : 'translateX(-50%)',
                        }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div ref={tooltipRef} className="px-3 py-1.5 rounded-md whitespace-nowrap">
                            <span className="text-sm text-white font-semibold">{tooltip}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                ref={buttonRef}
                className={`${RESPONSIVE_SIZES.button} rounded-lg flex items-center justify-center ${className}`}
                whileHover={{ scale: isDisabled ? 1 : 1.2 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                onClick={isDisabled ? undefined : onClick}
                onMouseEnter={() => !isDisabled && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <Icon className={`${RESPONSIVE_SIZES.icon} ${isDisabled ? 'text-gray-400' : 'text-cyan-400'}`} />
            </motion.div>
        </div>
    );
};

export const BettingView: React.FC = () => {
    const navigate = useNavigate();
    const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
    const { exist } = useAuthContext();

    const handlePlay = useCallback(() => {
        if (!selectedGame) return;
        navigate(`${PATH.GAME}${gamePath[selectedGame]}`);
    }, [navigate, selectedGame]);

    const handleDeposit = useCallback(() => {
        navigate(`${PATH.GAME}${PATH.DEPOSIT}`);
    }, [navigate]);

    const handleWithdraw = useCallback(() => {
        navigate(`${PATH.GAME}${PATH.WITHDRAW}`);
    }, [navigate]);

    const handleGameSelect = useCallback((game: GameType) => {
        setSelectedGame(game);
    }, []);

    const isBlockBingoSelected = useMemo(() => selectedGame === 'BlockBingo', [selectedGame]);

    const gameButtonClasses = useMemo(() => {
        const base = "relative p-4 3xs:p-5 2xs:p-5 xs:p-6 sm:p-6 md:p-7 lg:p-8 rounded-lg 3xs:rounded-xl 2xs:rounded-xl xs:rounded-xl border-2 transition-all duration-300 cursor-none";
        return isBlockBingoSelected
            ? `${base} border-cyan-500 bg-cyan-600/20 shadow-lg shadow-cyan-500/50`
            : `${base} border-gray-600 bg-gray-800/40 hover:border-gray-500 hover:bg-gray-800/60`;
    }, [isBlockBingoSelected]);

    const iconContainerClasses = useMemo(() => {
        return isBlockBingoSelected ? 'bg-cyan-500/20' : 'bg-gray-700/50';
    }, [isBlockBingoSelected]);

    const iconClasses = useMemo(() => {
        return isBlockBingoSelected ? 'text-cyan-400' : 'text-gray-400';
    }, [isBlockBingoSelected]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-128px)] relative overflow-hidden">
            <div className="flex w-full h-full relative z-10 flex-col items-center justify-center px-2 3xs:px-3 2xs:px-4 xs:px-4 sm:px-6 md:px-8 lg:px-10">
                <div className="w-full max-w-4xl flex flex-col items-center justify-center flex-1 gap-4 3xs:gap-5 2xs:gap-6 xs:gap-6 sm:gap-7 md:gap-8 lg:gap-10">
                    {/* Page Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-xl 3xs:text-2xl 2xs:text-2xl xs:text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 3xs:mb-1.5 2xs:mb-2">
                            Play Betting
                        </h1>
                    </motion.div>

                    {/* Game Selection Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full"
                    >
                        <div className="w-full flex items-center justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleGameSelect('BlockBingo')}
                                className={gameButtonClasses}
                            >
                                <div className="flex flex-col items-center gap-2 3xs:gap-3 2xs:gap-3 xs:gap-4 sm:gap-4">
                                    <div className={`${RESPONSIVE_SIZES.gameIcon} rounded-lg flex items-center justify-center ${iconContainerClasses}`}>
                                        <LiaDiceSolid className={`${RESPONSIVE_SIZES.gameIconText} ${iconClasses}`} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-base 3xs:text-lg 2xs:text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-white mb-0.5 3xs:mb-1">
                                            BlockBingo
                                        </h3>
                                    </div>
                                    {isBlockBingoSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1.5 3xs:top-2 2xs:top-2 right-1.5 3xs:right-2 2xs:right-2 w-5 h-5 3xs:w-6 3xs:h-6 2xs:w-6 2xs:h-6 bg-cyan-500 rounded-full flex items-center justify-center"
                                        >
                                            <span className="text-white text-[10px] 3xs:text-xs 2xs:text-xs">✓</span>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Action Buttons Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full flex items-center justify-center gap-12 pt-12"
                    >
                        <ActionButtonWithTooltip
                            icon={IoGameControllerOutline}
                            tooltip={selectedGame ? "Play Game" : "Select a game first"}
                            onClick={handlePlay}
                            isDisabled={!selectedGame}
                            className={selectedGame ? 'bg-cyan-500/20' : 'bg-gray-700/50'}
                        />
                        <ActionButtonWithTooltip
                            icon={TbMoneybag}
                            tooltip="Deposit Funds"
                            onClick={handleDeposit}
                            className="bg-cyan-500/20"
                        />
                        <ActionButtonWithTooltip
                            icon={HiArrowTrendingDown}
                            tooltip="Withdraw Funds"
                            onClick={handleWithdraw}
                            className="bg-cyan-500/20"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
