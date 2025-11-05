import { motion } from "framer-motion";
import { GameColumn } from "./GameColumn";

interface GameGridProps {
    columnPaused: boolean[];
    scrollPositions: number[];
    columnTileSequences: number[][];
    grid: number[][];
    matchingTiles: Set<string>;
    gameState: "idle" | "playing" | "finished";
    onColumnClick: (colIndex: number) => void;
}

export const GameGrid = ({
    columnPaused,
    scrollPositions,
    columnTileSequences,
    grid,
    matchingTiles,
    gameState,
    onColumnClick
}: GameGridProps) => {
    return (
        <div className="px-8 flex-1 flex flex-col">
            <div className="flex gap-4" style={{ height: '500px' }}>
                {[0, 1, 2].map((colIndex) => (
                    <GameColumn
                        key={colIndex}
                        colIndex={colIndex}
                        isPaused={columnPaused[colIndex]}
                        scrollPos={scrollPositions[colIndex]}
                        sequence={columnTileSequences[colIndex] || []}
                        grid={grid}
                        matchingTiles={matchingTiles}
                        gameState={gameState}
                        onColumnClick={onColumnClick}
                    />
                ))}
            </div>

            {gameState === "playing" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center text-cyan-400 font-semibold"
                >
                    Click on each column to stop it!
                </motion.div>
            )}
        </div>
    );
};

