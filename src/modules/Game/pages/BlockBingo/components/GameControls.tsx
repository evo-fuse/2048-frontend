import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaRedo, FaQuestionCircle, FaNetworkWired, FaCoins, FaWallet, FaTrophy, FaArrowUp, FaCheckCircle, FaArrowCircleDown } from "react-icons/fa";
import { HiArrowTrendingDown } from "react-icons/hi2";
import { LuDices } from "react-icons/lu";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import { Select } from "../../../../../components/Select";
import { PATH, TOKEN } from "../../../../../const";
import { User } from "../../../../../types";

interface IconButtonWithTooltipProps {
    icon: IconType;
    tooltip: string;
    onClick: () => void;
    className?: string;
}

const IconButtonWithTooltip: React.FC<IconButtonWithTooltipProps> = ({
    icon: Icon,
    tooltip,
    onClick,
    className = "",
}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipLeft, setTooltipLeft] = useState<number | undefined>(undefined);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        if (showTooltip && tooltipRef.current && buttonRef.current) {
            // Use requestAnimationFrame to ensure DOM is fully measured
            requestAnimationFrame(() => {
                if (tooltipRef.current && buttonRef.current) {
                    const tooltipWidth = tooltipRef.current.offsetWidth;
                    const buttonWidth = buttonRef.current.offsetWidth;
                    const leftOffset = -(tooltipWidth - buttonWidth) / 2;
                    setTooltipLeft(leftOffset);
                }
            });
        } else {
            // Reset when tooltip is hidden
            setTooltipLeft(undefined);
        }
    }, [showTooltip]);

    return (
        <div className="relative">
            <AnimatePresence>
                {showTooltip && (
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
                        <div ref={tooltipRef} className="bg-gray-800 px-3 py-1.5 rounded-md border border-white/20 whitespace-nowrap">
                            <span className="text-sm text-white font-semibold">{tooltip}</span>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-800"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.button
                ref={buttonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`${className} rounded-xl p-4 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 flex-shrink-0`}
            >
                <Icon className="text-white" size={24} />
            </motion.button>
        </div>
    );
};

interface GameControlsProps {
    gameState: "idle" | "playing" | "finished";
    network: string;
    currency: string;
    depositAmount: string;
    user: User | null;
    totalScore: number;
    currentBalance: number;
    rewardAmount: number;
    onNetworkChange: (value: string) => void;
    onCurrencyChange: (value: string) => void;
    onDepositAmountChange: (value: string) => void;
    onStartGame: () => void;
    onRestart: () => void;
    onOpenHelp: () => void;
    calculateReward: () => string;
    getUserBalanceKey: (network: string, currency: string) => keyof User;
}

export const GameControls = ({
    gameState,
    network,
    currency,
    depositAmount,
    user,
    totalScore,
    currentBalance,
    rewardAmount,
    onNetworkChange,
    onCurrencyChange,
    onDepositAmountChange,
    onStartGame,
    onRestart,
    onOpenHelp,
    getUserBalanceKey
}: GameControlsProps) => {
    const updatedBalance = currentBalance + rewardAmount;
    const navigate = useNavigate();

    const handleWithdraw = () => {
        navigate(PATH.GAME + PATH.WITHDRAW);
    };

    const handleBetting = () => {
        navigate(PATH.GAME + PATH.BETTING);
    };

    const handleDeposit = () => {
        navigate(PATH.GAME + PATH.DEPOSIT);
    };

    return (
        <div className="w-80 flex flex-col gap-6 h-full overflow-y-auto px-2">
            <div className="bg-gray-900/50 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                <h3 className="text-xl font-bold border-b border-white/10 pb-3">Game Controls</h3>

                {gameState === "idle" && (
                    <>
                        {/* Network Selection */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                                <FaNetworkWired className="text-cyan-400" />
                                <span>Network</span>
                            </div>
                            <Select
                                options={TOKEN.networkList}
                                value={network}
                                onChange={(value) => onNetworkChange(value as string)}
                            />
                        </div>

                        {/* Currency Selection */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                                <FaCoins className="text-yellow-400" />
                                <span>Currency</span>
                            </div>
                            <Select
                                options={TOKEN.tokenList}
                                value={currency}
                                onChange={(value) => onCurrencyChange(value as string)}
                            />
                        </div>

                        {/* Balance Display */}
                        <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                <FaWallet />
                                <span>Balance</span>
                            </div>
                            <div className="text-xl font-bold text-cyan-400">
                                {user?.[getUserBalanceKey(network, currency)] || 0} {currency}
                            </div>
                        </div>

                        {/* Deposit Amount */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-300 font-semibold">
                                <FaCoins className="text-purple-400" />
                                <span>Bet Amount</span>
                            </div>
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                placeholder="0.00"
                                value={depositAmount}
                                onChange={(e) => onDepositAmountChange(isNaN(Number(e.target.value)) ? depositAmount : e.target.value)}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
                            onClick={onStartGame}
                        >
                            <FaPlay size={18} />
                            <span>Start</span>
                        </motion.button>
                    </>
                )}

                {gameState === "finished" && (
                    <>
                        <div className="bg-gradient-to-br from-green-500/20 to-green-700/20 border border-green-500/30 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-200 mb-2 font-semibold">
                                <FaCheckCircle className="text-green-400" />
                                <span>Finished!</span>
                            </div>

                            {/* Total Score */}
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <FaTrophy className="text-white text-sm" />
                                    <span className="text-xs text-gray-400">Score</span>
                                </div>
                                <span className="text-lg font-bold text-white">{totalScore}</span>
                            </div>

                            {/* Current Balance */}
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <FaWallet className="text-cyan-400 text-sm" />
                                    <span className="text-xs text-gray-400">Balance</span>
                                </div>
                                <span className="text-lg font-semibold text-cyan-400">
                                    {currentBalance.toFixed(5)}
                                </span>
                            </div>

                            {/* Reward */}
                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <FaCoins className="text-yellow-400 text-sm" />
                                    <span className="text-xs text-gray-400">Reward</span>
                                </div>
                                <span className="text-lg font-semibold text-yellow-400">
                                    +{rewardAmount.toFixed(5)}
                                </span>
                            </div>

                            {/* Updated Balance */}
                            <div className="flex justify-between items-center py-3 bg-green-500/20 rounded-lg px-3 mt-2">
                                <div className="flex items-center gap-2">
                                    <FaArrowUp className="text-green-400" />
                                    <span className="text-sm font-bold text-gray-200">New</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xl font-bold text-green-400">
                                        {updatedBalance.toFixed(5)}
                                    </span>
                                    <span className="text-sm text-gray-400">{currency}</span>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
                            onClick={onRestart}
                        >
                            <FaRedo size={18} />
                            <span>Again</span>
                        </motion.button>
                    </>
                )}
            </div>

            {/* Help Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenHelp}
                className={`bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-center gap-3 transition-all duration-300 flex-shrink-0 ${gameState === "playing"
                    ? "opacity-50 cursor-none"
                    : "hover:bg-cyan-500/30"
                    }`}
            >
                <FaQuestionCircle className="text-cyan-400" size={24} />
                <span className="text-lg font-bold text-white">Help & Rules</span>
            </motion.button>

            {/* Action Buttons Container */}
            <div className="flex gap-4 justify-center flex-shrink-0">
                {/* Betting Button */}
                <IconButtonWithTooltip
                    icon={LuDices}
                    tooltip="Play Other Games"
                    onClick={handleBetting}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border border-cyan-500/50"
                />

                {/* Deposit Button */}
                <IconButtonWithTooltip
                    icon={FaArrowCircleDown}
                    tooltip="Deposit"
                    onClick={handleDeposit}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border border-cyan-500/50"
                />

                {/* Withdraw Button */}
                <IconButtonWithTooltip
                    icon={HiArrowTrendingDown}
                    tooltip="Withdraw"
                    onClick={handleWithdraw}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border border-cyan-500/50"
                />
            </div>
        </div>
    );
};

