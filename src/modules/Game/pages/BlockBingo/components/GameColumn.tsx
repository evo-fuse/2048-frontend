import { motion } from "framer-motion";
import { Images } from "../../../../../assets/images";

const SPORTS_BALLS = [
    { id: 0, image: Images.BASEBALL, name: "Baseball" },
    { id: 1, image: Images.BASKETBALL, name: "Basketball" },
    { id: 2, image: Images.BILLIARD, name: "Billiard" },
    { id: 3, image: Images.BOWLING, name: "Bowling" },
    { id: 4, image: Images.FOOTBALL, name: "Football" },
    { id: 5, image: Images.GOLF, name: "Golf" },
    { id: 6, image: Images.RUGBY, name: "Rugby" },
    { id: 7, image: Images.TABLETENNIS, name: "Table Tennis" },
    { id: 8, image: Images.TENNIS, name: "Tennis" },
    { id: 9, image: Images.VOLLEYBALL, name: "Volleyball" },
];

interface GameColumnProps {
    colIndex: number;
    isPaused: boolean;
    scrollPos: number;
    sequence: number[];
    grid: number[][];
    matchingTiles: Set<string>;
    gameState: "idle" | "playing" | "finished";
    onColumnClick: (colIndex: number) => void;
}

export const GameColumn = ({
    colIndex,
    isPaused,
    scrollPos,
    sequence,
    grid,
    matchingTiles,
    gameState,
    onColumnClick
}: GameColumnProps) => {
    const tileHeight = 100; // 500px / 5 rows = 100px per tile

    // Show static grid before game starts or when sequence not ready
    const shouldShowStaticGrid = sequence.length === 0 || gameState === "idle";

    return (
        <motion.div
            key={colIndex}
            className={`flex-1 h-full border-2 rounded-xl overflow-hidden relative ${isPaused ? "border-green-500" : "border-white/30 hover:border-cyan-500"
                } transition-all duration-300 cursor-none`}
            onClick={() => onColumnClick(colIndex)}
            whileHover={{ scale: gameState === "playing" && !isPaused ? 1.02 : 1 }}
            whileTap={{ scale: gameState === "playing" && !isPaused ? 0.98 : 1 }}
        >
            {gameState === "playing" && !isPaused && (
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none z-10" />
            )}

            {/* Render tiles - either scrolling or fixed */}
            {!shouldShowStaticGrid && !isPaused ? (
                // Scrolling tiles
                <div
                    className="absolute w-full"
                    style={{
                        transform: `translateY(-${scrollPos}%)`,
                        height: `${tileHeight * sequence.length}px`
                    }}
                >
                    {sequence.map((ballId, index) => (
                        <div
                            key={`${colIndex}-tile-${index}`}
                            className="flex items-center justify-center bg-gray-900/50 border-b border-white/10"
                            style={{ height: `${tileHeight}px` }}
                        >
                            <img
                                src={SPORTS_BALLS[ballId].image}
                                alt={SPORTS_BALLS[ballId].name}
                                className="w-20 h-20 object-contain transition-transform"
                            />
                        </div>
                    ))}
                </div>
            ) : (
                // Fixed tiles showing the result (5 rows) or initial state
                <div className="absolute inset-0 flex flex-col">
                    {[0, 1, 2, 3, 4].map((rowIndex) => {
                        const isMatching = matchingTiles.has(`${rowIndex}-${colIndex}`);
                        const isScoringArea = rowIndex >= 1 && rowIndex <= 3;
                        const isTopRow = rowIndex === 0;
                        const isBottomRow = rowIndex === 4;

                        return (
                            <div
                                key={rowIndex}
                                className={`flex-1 flex items-center justify-center border-b border-white/10 relative ${isMatching
                                    ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30'
                                    : isScoringArea
                                        ? 'bg-gray-900/70'
                                        : 'bg-gray-900/30'
                                    }`}
                            >
                                {/* Blur overlay for top and bottom rows */}
                                {(isTopRow || isBottomRow) && (
                                    <div className="absolute inset-0 backdrop-blur-sm bg-black/20 z-10" />
                                )}

                                {/* Scoring area indicator */}
                                {isScoringArea && !isMatching && colIndex === 0 && rowIndex === 1 && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50" />
                                )}
                                {isScoringArea && !isMatching && colIndex === 2 && rowIndex === 1 && (
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-500/50" />
                                )}

                                <div className={`relative ${isMatching ? 'animate-pulse' : ''}`}>
                                    <img
                                        src={SPORTS_BALLS[grid[rowIndex][colIndex]].image}
                                        alt={SPORTS_BALLS[grid[rowIndex][colIndex]].name}
                                        className={`w-20 h-20 object-contain transition-all ${isMatching ? 'drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] scale-110' : ''
                                            } ${isScoringArea ? 'opacity-100' : 'opacity-40'}`}
                                    />
                                    {isMatching && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 border-4 border-yellow-400 rounded-xl"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isPaused && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-green-500/5 pointer-events-none"
                />
            )}
        </motion.div>
    );
};

