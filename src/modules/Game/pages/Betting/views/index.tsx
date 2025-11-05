import { PATH } from "../../../../../const";
import { LuDices } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { HiArrowTrendingDown } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useCallback } from "react";
import { GameCard } from "../components/GameCard";
import { GAMES, cardVariants, buttonVariants } from "../constants";

export const BettingView = () => {
    const navigate = useNavigate();
    const [selectedGameId, setSelectedGameId] = useState<string>("");

    // Memoize the selected game object
    const selectedGame = useMemo(
        () => GAMES.find((game) => game.id === selectedGameId),
        [selectedGameId]
    );

    // Memoized callback for game selection
    const handleGameSelect = useCallback((id: string) => {
        setSelectedGameId(id);
    }, []);

    // Memoized callback for play button
    const handlePlayNow = useCallback(() => {
        const gamePath = selectedGame?.path || PATH.BLOCK_BINGO;
        navigate(PATH.GAME + gamePath);
    }, [navigate, selectedGame]);

    // Memoized callback for deposit button
    const handleDeposit = useCallback(() => {
        navigate(PATH.GAME + PATH.DEPOSIT);
    }, [navigate]);

    // Memoized callback for withdraw button
    const handleWithdraw = useCallback(() => {
        navigate(PATH.GAME + PATH.WITHDRAW);
    }, [navigate]);

    return (
        <div className="w-full h-full text-white flex gap-4">
            <div className="w-full flex flex-col gap-4">
                {/* Header with gradient accent */}
                <div className="relative">
                    <h2 className="text-2xl font-bold py-6 px-8 border-b border-white/10">
                        Place Your Bet
                    </h2>
                </div>

                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                    {/* Game Cards - Data-driven rendering */}
                    <div className="flex items-center gap-4">
                        {GAMES.map((game) => (
                            <GameCard
                                key={game.id}
                                game={game}
                                isSelected={selectedGameId === game.id}
                                onSelect={handleGameSelect}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full max-w-4xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handlePlayNow}
                                disabled={!selectedGameId}
                                className={`flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg cursor-none group ${selectedGameId
                                    ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white hover:shadow-cyan-500/50"
                                    : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                                    }`}
                            >
                                {selectedGame?.icon ? (
                                    <selectedGame.icon
                                        size={20}
                                        className="group-hover:rotate-12 transition-transform"
                                    />
                                ) : (
                                    <LuDices
                                        size={20}
                                        className="group-hover:rotate-12 transition-transform"
                                    />
                                )}
                                <span className="text-base">
                                    {selectedGameId ? `Play ${selectedGame?.name}` : "Select a Game"}
                                </span>
                            </motion.button>

                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleDeposit}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-gray-500/30 cursor-none group border border-white/10"
                            >
                                <TbMoneybag size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-base">Deposit</span>
                            </motion.button>

                            <motion.button
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={handleWithdraw}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 cursor-none group border border-white/10"
                            >
                                <HiArrowTrendingDown size={20} className="group-hover:scale-110 transition-transform" />
                                <span className="text-base">Withdraw</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};