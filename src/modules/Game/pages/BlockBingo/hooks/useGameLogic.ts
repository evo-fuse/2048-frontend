import { useState, useEffect, useRef, useCallback } from "react";
import { User } from "../../../../../types";
import { Toast } from "../../../../../components";
import { GameState, SPORTS_BALLS, MULTIPLIER_2_HORIZONTAL, MULTIPLIER_3_HORIZONTAL, MULTIPLIER_3_DIAGONAL, DIVIDE_THRESHOLD } from "../constants/balls";
import { useAuthContext } from "../../../../../context";

export const useGameLogic = (user: User | null, network: string, currency: string, depositAmount: string) => {
    const { handleUpdateUser, handleUser, setUser } = useAuthContext();
    const [gameState, setGameState] = useState<GameState>("idle");

    // Initialize grid with random tiles
    const initializeGrid = () => {
        const newGrid: number[][] = [];
        for (let row = 0; row < 5; row++) {
            const rowData: number[] = [];
            for (let col = 0; col < 3; col++) {
                rowData.push(Math.floor(Math.random() * SPORTS_BALLS.length));
            }
            newGrid.push(rowData);
        }
        return newGrid;
    };

    const [grid, setGrid] = useState<number[][]>(initializeGrid());
    const [columnTileSequences, setColumnTileSequences] = useState<number[][]>([[], [], []]);
    const [columnPaused, setColumnPaused] = useState<boolean[]>([false, false, false]);
    const [scrollPositions, setScrollPositions] = useState<number[]>([0, 0, 0]);
    const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [lastScore, setLastScore] = useState<number>(0);
    const [matchingTiles, setMatchingTiles] = useState<Set<string>>(new Set());
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [rewardAmount, setRewardAmount] = useState<number>(0);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    const getUserBalanceKey = useCallback((network: string, currency: string): keyof User => {
        const networkPrefix = {
            "Fuse": "fuse",
            "Ethereum": "eth",
            "Binance": "bnb",
            "Polygon": "pol"
        }[network] || "fuse";

        const currencySuffix = currency.toLowerCase();
        return (networkPrefix + currencySuffix) as keyof User;
    }, []);

    const generateRandomTileSequence = useCallback((count: number): number[] => {
        const sequence: number[] = [];
        for (let i = 0; i < count; i++) {
            sequence.push(Math.floor(Math.random() * SPORTS_BALLS.length));
        }
        return sequence;
    }, []);

    const initializeColumnSequences = useCallback(() => {
        const sequences: number[][] = [];
        for (let col = 0; col < 3; col++) {
            sequences.push(generateRandomTileSequence(50));
        }
        setColumnTileSequences(sequences);
    }, [generateRandomTileSequence]);

    // Animation for flowing tiles - continuous scrolling
    useEffect(() => {
        if (gameState !== "playing") return;

        const animate = () => {
            setScrollPositions(prev => prev.map((pos, colIndex) => {
                if (columnPaused[colIndex]) return pos;
                return (pos + 1) % 100;
            }));
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState, columnPaused]);

    const handleColumnClick = useCallback((colIndex: number) => {
        if (gameState !== "playing" || columnPaused[colIndex]) return;

        const newColumnPaused = [...columnPaused];
        newColumnPaused[colIndex] = true;
        setColumnPaused(newColumnPaused);

        const tileHeight = 100;
        const scrollPos = scrollPositions[colIndex];
        const sequence = columnTileSequences[colIndex];

        const totalHeight = tileHeight * sequence.length;
        const currentScrollPx = (scrollPos / 100) * totalHeight;
        const startTileIndex = Math.floor(currentScrollPx / tileHeight);

        const newGrid = [...grid];
        for (let row = 0; row < 5; row++) {
            const tileIndex = (startTileIndex + row) % sequence.length;
            newGrid[row][colIndex] = sequence[tileIndex];
        }
        setGrid(newGrid);

        if (newColumnPaused.every(paused => paused)) {
            handleRoundComplete(newGrid);
        }
    }, [gameState, columnPaused, scrollPositions, columnTileSequences, grid]);

    const calculateScore = useCallback((finalGrid: number[][]) => {
        let score = 0;
        const matches = new Set<string>();
        const scoringStartRow = 1;
        const matchedCells = new Set<string>();

        // Check 3 horizontal matches first (priority)
        for (let row = scoringStartRow; row < scoringStartRow + 3; row++) {
            if (finalGrid[row][0] === finalGrid[row][1] && finalGrid[row][1] === finalGrid[row][2]) {
                const tileId = finalGrid[row][0];
                const tileWeight = SPORTS_BALLS[tileId]?.weight || 0;
                score += tileWeight * MULTIPLIER_3_HORIZONTAL;

                matches.add(`${row}-0`);
                matches.add(`${row}-1`);
                matches.add(`${row}-2`);
                matchedCells.add(`${row}-0`);
                matchedCells.add(`${row}-1`);
                matchedCells.add(`${row}-2`);
            }
        }

        // Check 2 horizontal matches (only if not part of 3-match)
        for (let row = scoringStartRow; row < scoringStartRow + 3; row++) {
            for (let col = 0; col < 2; col++) {
                const cell1 = `${row}-${col}`;
                const cell2 = `${row}-${col + 1}`;

                // Skip if already part of a 3-match
                if (matchedCells.has(cell1) && matchedCells.has(cell2)) {
                    continue;
                }

                if (finalGrid[row][col] === finalGrid[row][col + 1]) {
                    const tileId = finalGrid[row][col];
                    const tileWeight = SPORTS_BALLS[tileId]?.weight || 0;
                    score += tileWeight * MULTIPLIER_2_HORIZONTAL;

                    matches.add(cell1);
                    matches.add(cell2);
                }
            }
        }

        // Check diagonal matches (top-left to bottom-right)
        if (finalGrid[1][0] === finalGrid[2][1] && finalGrid[2][1] === finalGrid[3][2]) {
            const tileId = finalGrid[2][1];
            const tileWeight = SPORTS_BALLS[tileId]?.weight || 0;
            score += tileWeight * MULTIPLIER_3_DIAGONAL;

            matches.add('1-0');
            matches.add('2-1');
            matches.add('3-2');
        }

        // Check diagonal matches (top-right to bottom-left)
        if (finalGrid[1][2] === finalGrid[2][1] && finalGrid[2][1] === finalGrid[3][0]) {
            const tileId = finalGrid[2][1];
            const tileWeight = SPORTS_BALLS[tileId]?.weight || 0;
            score += tileWeight * MULTIPLIER_3_DIAGONAL;

            matches.add('1-2');
            matches.add('2-1');
            matches.add('3-0');
        }

        setMatchingTiles(matches);
        return score;
    }, []);

    const handleRoundComplete = useCallback(async (finalGrid: number[][]) => {
        const roundScore = calculateScore(finalGrid);
        setLastScore(roundScore);

        let calculatedReward = 0;
        setTotalScore(prev => {
            const newTotal = prev + roundScore;

            // Calculate reward on final round: reward = deposit * score / DIVIDE_THRESHOLD
            if (attemptsLeft - 1 <= 0) {
                calculatedReward = (Number(depositAmount) * newTotal) / DIVIDE_THRESHOLD;
                setRewardAmount(calculatedReward);
            }

            return newTotal;
        });
        setAttemptsLeft(prev => prev - 1);

        if (attemptsLeft - 1 <= 0) {
            setTimeout(async () => {
                setGameState("finished");

                // Update backend with new balance using AuthContext
                if (user) {
                    try {
                        const balanceKey = getUserBalanceKey(network, currency);
                        const updatedBalance = currentBalance + calculatedReward;

                        // Update user balance in backend
                        await handleUpdateUser({
                            ...user,
                            [balanceKey]: updatedBalance.toString()
                        });

                        // Refresh user data from backend
                        const refreshedUser = await handleUser(user.address);
                        setUser({ ...refreshedUser, address: user.address });
                    } catch (error) {
                        Toast.error("Update Failed", "Failed to update balance on server. Please contact support.");
                    }
                }
            }, 2000);
        } else {
            setTimeout(() => {
                setColumnPaused([false, false, false]);
                setMatchingTiles(new Set());
                initializeColumnSequences();
            }, 2000);
        }
    }, [attemptsLeft, calculateScore, initializeColumnSequences, depositAmount, user, currentBalance, network, currency, getUserBalanceKey, handleUpdateUser, handleUser, setUser]);

    const closeErrorModal = useCallback(() => {
        setErrorModal(null);
    }, []);

    const handleStartGame = useCallback(() => {
        if (!depositAmount || Number(depositAmount) <= 0) {
            setErrorModal({
                title: "Invalid Amount",
                message: "Please enter a valid deposit amount greater than 0."
            });
            return;
        }

        const deposit = Number(depositAmount);
        const balanceKey = getUserBalanceKey(network, currency);
        const userBalance = Number(user?.[balanceKey] || 0);

        if (deposit > userBalance) {
            setErrorModal({
                title: "Insufficient Balance",
                message: "You don't have enough balance to play with this amount."
            });
            return;
        }

        // Capture current balance (after deducting deposit) before game starts
        setCurrentBalance(userBalance - deposit);
        setRewardAmount(0);

        initializeColumnSequences();

        setGameState("playing");
        setAttemptsLeft(10);
        setTotalScore(0);
        setLastScore(0);
        setMatchingTiles(new Set());
        setColumnPaused([false, false, false]);
        setScrollPositions([0, 0, 0]);
    }, [depositAmount, network, currency, user, getUserBalanceKey, initializeColumnSequences]);

    const handleRestart = useCallback(() => {
        setGameState("idle");
        setAttemptsLeft(10);
        setTotalScore(0);
        setLastScore(0);
        setMatchingTiles(new Set());
        setColumnPaused([false, false, false]);
        setScrollPositions([0, 0, 0]);
    }, []);

    const calculateReward = useCallback(() => {
        return ((Number(depositAmount) * totalScore) / DIVIDE_THRESHOLD).toFixed(5);
    }, [totalScore, depositAmount]);

    return {
        gameState,
        grid,
        columnTileSequences,
        columnPaused,
        scrollPositions,
        attemptsLeft,
        totalScore,
        lastScore,
        matchingTiles,
        currentBalance,
        rewardAmount,
        handleColumnClick,
        handleStartGame,
        handleRestart,
        calculateReward,
        getUserBalanceKey,
        errorModal,
        closeErrorModal
    };
};

