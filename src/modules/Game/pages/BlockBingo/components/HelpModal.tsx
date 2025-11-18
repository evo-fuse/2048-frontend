import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTimes, FaNetworkWired, FaCoins, FaWallet, FaMousePointer, FaDice, FaTrophy, FaStar, FaCalculator, FaFootballBall } from "react-icons/fa";
import {
    DIVIDE_THRESHOLD,
    MULTIPLIER_2_HORIZONTAL,
    MULTIPLIER_3_DIAGONAL,
    MULTIPLIER_3_HORIZONTAL,
    SPORTS_BALLS
} from "../constants/balls";

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header - Sticky */}
                        <div className="sticky top-0 z-10 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-between p-8 pb-4 border-b border-cyan-500/30 rounded-t-2xl">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                Help & Rules
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-cyan-400 transition-colors p-2 hover:bg-cyan-500/10 rounded-lg"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 px-8 pb-8">
                            <div className="space-y-6 pt-6">
                                {/* How to Play Section */}
                                <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6">
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <FaPlay size={20} />
                                        How to Play
                                    </h3>
                                    <ul className="text-gray-300 space-y-2">
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaNetworkWired className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Select <strong>Network</strong> & <strong>Currency</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaWallet className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Check your <strong>Balance</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaCoins className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Set <strong>Bet Amount</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaPlay className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Click <strong>Start</strong></span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaDice className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm"><strong>3x5 grid</strong> - tiles flow continuously</span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaMousePointer className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Click columns to <strong>stop</strong> them</span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaStar className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Center <strong>3x3</strong> = scoring area</span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaTrophy className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm">Match balls to earn points</span>
                                        </li>
                                        <li className="flex items-center gap-3 p-2 hover:bg-cyan-500/5 rounded-lg transition-colors">
                                            <FaDice className="text-cyan-400 text-xl flex-shrink-0" />
                                            <span className="text-sm"><strong>10 attempts</strong> to win rewards!</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Tile Weights Section */}
                                <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6">
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <FaFootballBall size={20} />
                                        Tile Weights
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2">
                                        {SPORTS_BALLS.sort((a, b) => b.weight - a.weight).map((ball) => (
                                            <div
                                                key={ball.id}
                                                className="flex items-center justify-between p-2 bg-cyan-500/5 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <img src={ball.image} alt={ball.name} className="w-6 h-6" />
                                                    <span className="text-gray-300 text-xs">{ball.name}</span>
                                                </div>
                                                <span className="text-cyan-400 font-bold text-sm">{ball.weight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scoring Rules Section */}
                                <div className="bg-white/5 border border-cyan-500/30 rounded-xl p-6">
                                    <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <FaTrophy size={20} />
                                        Scoring Multipliers
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Visual Grid Examples */}
                                        <div className="space-y-3">
                                            {/* 2 Horizontal Example */}
                                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-300 text-sm font-semibold">2 Horizontal Match</span>
                                                    <span className="text-cyan-400 font-bold">Weight × {MULTIPLIER_2_HORIZONTAL}</span>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <div className="grid grid-cols-3 gap-1">
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">⚽</div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">⚽</div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3 Horizontal Example */}
                                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-300 text-sm font-semibold">3 Horizontal Match</span>
                                                    <span className="text-cyan-400 font-bold">Weight × {MULTIPLIER_3_HORIZONTAL}</span>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <div className="grid grid-cols-3 gap-1">
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">🏀</div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">🏀</div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">🏀</div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3 Diagonal Example */}
                                            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-gray-300 text-sm font-semibold">3 Diagonal Match</span>
                                                    <span className="text-cyan-400 font-bold">Weight × {MULTIPLIER_3_DIAGONAL}</span>
                                                </div>
                                                <div className="flex gap-1 justify-center">
                                                    <div className="grid grid-cols-3 gap-1">
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">🏈</div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">🏈</div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center"></div>
                                                        <div className="w-10 h-10 bg-cyan-500/30 border-2 border-cyan-400 rounded flex items-center justify-center text-xl">🏈</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                                            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2 font-semibold">
                                                <FaCalculator className="text-cyan-400" />
                                                <span>Reward Formula</span>
                                            </div>
                                            <div className="text-base text-cyan-400 font-mono font-bold">
                                                (Bet × Score) / {DIVIDE_THRESHOLD}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Score = Total from 10 attempts
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

