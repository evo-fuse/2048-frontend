import { motion } from "framer-motion";
import { FaDice, FaTrophy, FaStar } from "react-icons/fa";

interface GameStatsProps {
    attemptsLeft: number;
    totalScore: number;
    lastScore: number;
}

export const GameStats = ({ attemptsLeft, totalScore, lastScore }: GameStatsProps) => {
    return (
        <div className="px-8 grid grid-cols-3 gap-4">
            <motion.div
                className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
            >
                <FaDice className="text-purple-400 text-2xl" />
                <div>
                    <div className="text-xs text-gray-400">Attempts</div>
                    <div className="text-3xl font-bold text-purple-400">{attemptsLeft}</div>
                </div>
            </motion.div>

            <motion.div
                className="bg-gradient-to-br from-cyan-500/20 to-cyan-700/20 border border-cyan-500/30 rounded-xl p-4 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
            >
                <FaTrophy className="text-cyan-400 text-2xl" />
                <div>
                    <div className="text-xs text-gray-400">Total</div>
                    <div className="text-3xl font-bold text-cyan-400">{totalScore}</div>
                </div>
            </motion.div>

            <motion.div
                className="bg-gradient-to-br from-green-500/20 to-green-700/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
            >
                <FaStar className="text-green-400 text-2xl" />
                <div>
                    <div className="text-xs text-gray-400">Last</div>
                    <div className="text-3xl font-bold text-green-400">
                        {lastScore > 0 && "+"}
                        {lastScore}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

