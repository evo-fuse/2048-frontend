import { FC, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { ThemeProvider } from "styled-components";
import Box from "../components/Box";
import Control from "../components/Control/Control";
import GameBoard from "../components/GameBoard";
import ScoreBoard from "../components/ScoreBoard";
import useGameBoard, { Tile } from "../hooks/useGameBoard";
import useGameScore from "../hooks/useGameScore";
import useGameState from "../hooks/useGameState";
import useScaleControl from "../hooks/useScaleControl";
import { GRID_SIZE, MIN_SCALE, SPACING } from "../utils/constants";
import useLocalStorage from "../hooks/useLocalStorage";
import { ThemeName } from "../themes/types";
import useTheme from "../hooks/useTheme";
import { canGameContinue } from "../utils/rules";
import { useGameContext } from "../../../context/GameContext";
import { AnimatePresence, motion } from "framer-motion";
import { Images } from "../../../../../assets/images";
import { ItemBar } from "../components/ItemBar/ItemBar";
import { useAuthContext, useRecordContext } from "../../../../../context";
import { TileView } from "../components/TileView";
import { useOpen } from "../../../../../hooks";
import RewardModal from "../components/RewardModal";
import { ItemModal } from "../components/ItemModal";
import RecordModal from "../components/RecordModal";

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  currentScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = "react-2048";

// Praise messages by tile value range
const getPraiseMessage = (tileValue: number): string => {
  const praises = {
    low: [
      "Smooth!",
      "Clean merge!",
      "Nice swipe!",
      "Too easy for you!",
      "Tiles respect you."
    ],
    medium: [
      "Bruh, chill—genius mode!",
      "Illegal merge detected.",
      "Your IQ is showing.",
      "Teach me that swipe.",
      "Tiles fear you now."
    ],
    high: [
      "BOOM!",
      "Fusion unlocked!",
      "Power move!",
      "You're cooking!",
      "Peak gaming."
    ],
    veryHigh: [
      "Keep going!",
      "One more!",
      "You're close!",
      "Don't stop now!",
      "Big brain energy!"
    ]
  };

  if (tileValue >= 8192) {
    return praises.veryHigh[Math.floor(Math.random() * praises.veryHigh.length)];
  } else if (tileValue >= 2048 && tileValue <= 4096) {
    return praises.high[Math.floor(Math.random() * praises.high.length)];
  } else if (tileValue >= 256 && tileValue <= 1024) {
    return praises.medium[Math.floor(Math.random() * praises.medium.length)];
  } else if (tileValue >= 2 && tileValue <= 128) {
    return praises.low[Math.floor(Math.random() * praises.low.length)];
  } else {
    // Fallback for values outside ranges
    return praises.low[Math.floor(Math.random() * praises.low.length)];
  }
};

// Game Play Tips Component
const GamePlayTip: FC = () => {
  const tips = [
    "Always keep your highest tile in a corner.",
    "Focus on combining tiles in one direction.",
    "Don't make moves just to make them.",
    "Don't rush your moves."
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={currentTipIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {tips[currentTipIndex]}
      </motion.span>
    </AnimatePresence>
  );
};

// Get category from tile value
const getCategory = (tileValue: number): 'low' | 'medium' | 'high' | 'veryHigh' => {
  if (tileValue >= 8192) {
    return 'veryHigh';
  } else if (tileValue >= 2048 && tileValue <= 4096) {
    return 'high';
  } else if (tileValue >= 256 && tileValue <= 1024) {
    return 'medium';
  } else {
    return 'low';
  }
};

// Praise Pop-up Component
interface PraisePopup {
  id: string;
  message: string;
  x: number;
  y: number;
  tileValue: number;
  category: 'low' | 'medium' | 'high' | 'veryHigh';
  colorIndex: number; // Index for unique color assignment
}

// Color options: light-green, light-pink, light-yellow for low/medium, red for high
const popupColors = [
  { text: "text-green-200", glow: "rgba(187, 247, 208, 0.9)" }, // light-green
  { text: "text-pink-200", glow: "rgba(251, 207, 232, 0.9)" },  // light-pink
  { text: "text-yellow-200", glow: "rgba(254, 240, 138, 0.9)" }, // light-yellow
];

const PraisePopUp: FC<{ popup: PraisePopup; onEarthquake?: () => void }> = ({ popup, onEarthquake }) => {
  const isHighCategory = popup.category === 'high' || popup.category === 'veryHigh';
  const isMedium = popup.category === 'medium';

  // Color selection: red for high/veryHigh, otherwise use colorIndex
  const color = isHighCategory
    ? { text: "text-red-400", glow: "rgba(248, 113, 113, 0.9)" }
    : popupColors[popup.colorIndex % popupColors.length];

  // Animation settings based on category
  const animationConfig = isHighCategory
    ? {
      // High: Center position, longer animation, bigger text, earthquake effect
      initial: { opacity: 0, scale: 0.3, y: 0 },
      animate: {
        opacity: [0, 1, 1, 1, 0],
        scale: [0.3, 1.3, 1.2, 1.1, 0.9],
        y: [0, -20, -30, -40],
      },
      transition: { duration: 4, ease: "easeOut" },
      textSize: "text-3xl sm:text-4xl md:text-5xl",
    }
    : isMedium
      ? {
        // Medium: Longer animation, bigger text
        initial: { opacity: 0, scale: 0.5, y: 0 },
        animate: {
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.2, 1, 0.9],
          y: [0, -70, -90],
        },
        transition: { duration: 3.5, ease: "easeOut" },
        textSize: "text-xl sm:text-2xl md:text-3xl",
      }
      : {
        // Low: Short animation, smaller text
        initial: { opacity: 0, scale: 0.5, y: 0 },
        animate: {
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1.1, 1, 0.9],
          y: [0, -50, -60],
        },
        transition: { duration: 1.5, ease: "easeOut" },
        textSize: "text-base sm:text-lg md:text-xl",
      };

  // Trigger earthquake effect for high categories
  useEffect(() => {
    if (isHighCategory && onEarthquake) {
      onEarthquake();
    }
  }, [isHighCategory, onEarthquake]);

  return (
    <motion.div
      key={popup.id}
      className="absolute pointer-events-none z-50"
      style={{
        left: isHighCategory ? '50%' : `${popup.x}%`,
        top: isHighCategory ? '50%' : `${popup.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={{ opacity: 0 }}
      transition={animationConfig.transition}
    >
      <span
        className={`${color.text} font-extrabold ${animationConfig.textSize} drop-shadow-2xl whitespace-nowrap`}
        style={{
          textShadow: `0 0 20px ${color.glow}, 0 0 40px ${color.glow}${isHighCategory ? ', 0 0 60px ' + color.glow : ''}`,
        }}
      >
        {popup.message}
      </span>
    </motion.div>
  );
};

export const MainView: FC = () => {
  const {
    initialSetup,
    setInitialSetup,
    showPowerupAnimation,
    setPowerup,
    powerup,
    isOpenItemModal,
    onCloseItemModal,
    itemModalNotice,
    onOpenItemModal,
    setItemModalNotice,
  } = useGameContext();
  const { handleUser, setUser, handleGetWalletAddress } = useAuthContext();
  const { isOpen, onOpen, onClose } = useOpen();
  const [pendingFunction, setPendingFunction] = useState<Function>(() => { });

  useEffect(() => {
    handleUser().then((data) => {
      handleGetWalletAddress().then((address) => {
        setUser({ ...data, address });
      });
    });
  }, []);

  const [gameState, setGameStatus] = useGameState({
    status: "running",
    pause: false,
  });

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: "dark",
    bestScore: 0,
    currentScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [initialTiles, setInitialTiles] = useLocalStorage<Tile[]>(
    `initialTiles`,
    []
  );

  const [_, setIndex] = useLocalStorage<number>("index", 0);

  const [{ name: themeName, value: themeValue }] = useTheme(config.theme);

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  const onChangeGrid = useCallback(
    (value: number) => {
      onOpen();
      setPendingFunction(() => {
        return () => {
          setRows(value);
          setCols(value);
          setInitialSetup(true);
        };
      });
    },
    [setRows, setCols, setInitialSetup]
  );

  const { total, best, addScore, setTotal } = useGameScore(
    config.bestScore,
    config.currentScore
  );

  const {
    tiles,
    grid,
    onMove,
    onMovePending,
    onMergePending,
    breakTile,
    doubleTile,
  } = useGameBoard({
    rows,
    cols,
    gameState,
    addScore,
    initialTiles,
  });

  const onResetGame = useCallback(() => {
    onOpen();
    setPendingFunction(() => {
      return () => setGameStatus("restart");
    });
  }, [setGameStatus, onOpen, setPendingFunction]);

  if (gameState.status === "restart") {
    setTotal(0);
    setGameStatus("running");
  }
  // Use effect for checking game state to avoid render loop issues
  useEffect(() => {
    if (gameState.status === "running" && !canGameContinue(grid, tiles)) {
      setGameStatus("lost");
      onOpen();
      setPendingFunction(() => {
        return () => setGameStatus("restart");
      });
    }
  }, [
    gameState.status,
    grid,
    tiles,
    setGameStatus,
    onOpen,
    setPendingFunction,
  ]);

  useEffect(() => {
    if (initialSetup) {
      setGameStatus("restart");
      setInitialSetup(false);
    }
  }, [rows, cols, setGameStatus, initialSetup]);

  useEffect(() => {
    setConfig({
      rows,
      cols,
      bestScore: best,
      currentScore: total,
      theme: themeName,
    });
  }, [rows, cols, best, total, themeName, setConfig]);

  useEffect(() => {
    setPowerup(powerup > 0 ? powerup - 1 : 0);
    setInitialTiles(tiles);
    setIndex(Math.max(...tiles.map((tile) => tile.index)) + 1);
  }, [setInitialTiles, tiles, setPowerup]);

  const maxTile = useMemo(() => {
    return Math.max(...tiles.map((tile) => tile.value));
  }, [tiles]);

  // Track merging tiles for pop-up praise messages - only one per swipe
  const [praisePopups, setPraisePopups] = useState<PraisePopup[]>([]);
  const [earthquakeActive, setEarthquakeActive] = useState(false);
  const previousTilesRef = useRef<Tile[]>([]);
  const popupIdCounter = useRef(0);
  const hasShownPopupForSwipeRef = useRef(false);

  // Earthquake effect handler
  const triggerEarthquake = useCallback(() => {
    setEarthquakeActive(true);
    setTimeout(() => {
      setEarthquakeActive(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Find newly merged tiles
    const currentMergingTiles = tiles.filter(tile => tile.ismerging);
    const previousMergingTiles = previousTilesRef.current.filter(tile => tile.ismerging);

    // Check if there's a new merge (tile that wasn't merging before but is now)
    if (currentMergingTiles.length > 0 && !hasShownPopupForSwipeRef.current) {
      const newMerges = currentMergingTiles.filter(
        tile => !previousMergingTiles.some(prev => prev.id === tile.id)
      );

      // Only show one pop-up per swipe - use maximum merged tile value
      if (newMerges.length > 0) {
        hasShownPopupForSwipeRef.current = true;

        // Find the highest value among newly merged tiles
        const maxMergedValue = Math.max(...newMerges.map(tile => tile.value));
        const category = getCategory(maxMergedValue);
        const message = getPraiseMessage(maxMergedValue);

        // Determine animation duration based on category
        const animationDuration = category === 'low' ? 1500 : category === 'medium' ? 3500 : 4000;

        const popup: PraisePopup = {
          id: `popup-${popupIdCounter.current++}`,
          message,
          x: Math.random() * 60 + 20, // Random position between 20% and 80% (not used for high)
          y: Math.random() * 60 + 20,
          tileValue: maxMergedValue,
          category,
          colorIndex: popupIdCounter.current - 1, // Each popup gets its own color index
        };

        setPraisePopups(prev => [...prev, popup]);

        // Remove popup after animation completes
        setTimeout(() => {
          setPraisePopups(prev => prev.filter(p => p.id !== popup.id));
        }, animationDuration);
      }
    }

    // Reset the flag when no tiles are merging (swipe completed)
    if (currentMergingTiles.length === 0) {
      hasShownPopupForSwipeRef.current = false;
    }

    previousTilesRef.current = tiles;
  }, [tiles]);

  const handleOpenItemModal = (notice: string) => {
    onOpenItemModal();
    setItemModalNotice(notice);
  };

  const { isRecordOpen, onRecordClose } = useRecordContext();

  return (
    <ThemeProvider theme={themeValue}>
      <RewardModal
        isOpen={isOpen}
        onClose={onClose}
        maxTile={maxTile}
        total={total}
        status={gameState.status}
        pendingFunction={pendingFunction}
      />
      <RecordModal
        rows={rows}
        cols={cols}
        isOpen={isRecordOpen}
        total={total}
        onClose={onRecordClose}
      />
      <ItemModal
        isOpen={isOpenItemModal}
        onClose={onCloseItemModal}
        notice={itemModalNotice}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center w-full h-full items-center gap-12"
      >
        <Box
          justifycontent="center"
          blocksize="100%"
          alignitems="center"
          borderradius={0}
        >
          <div
            className="flex justify-center flex-col"
            style={{ width: `${GRID_SIZE}px` }}
          >
            {/* Title Section with Enhanced Layout */}
            <div className="w-full mb-4">
              <div className="flex flex-row items-center justify-between gap-4">
                {/* Left Section: Logo and Controls */}
                <div className="flex flex-row items-center gap-3">
                  <div className="relative flex items-center gap-2">
                    <img
                      src={Images.LOGO}
                      alt="EvoFuse"
                      className="w-12 h-12 drop-shadow-lg"
                    />
                  </div>
                  <div className="flex items-center">
                    <Control
                      rows={rows}
                      cols={cols}
                      tiles={tiles}
                      onReset={onResetGame}
                      onChangeGrid={onChangeGrid}
                    />
                  </div>
                </div>

                {/* Right Section: Score Boards */}
                <div className="flex gap-4">
                  <ScoreBoard total={total} title="score" />
                  <ScoreBoard total={best} title="best" />
                </div>
              </div>
            </div>

            {/* Game Play Tip Bar */}
            <Box
              inlinesize="100%"
              justifycontent="center"
              marginblockstart="s3"
              marginblockend="s3"
            >
              <div className="relative w-full max-w-2xl">
                <div className="bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-2.5 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-cyan-300/10 to-cyan-400/10 rounded-lg blur-sm"></div>
                  <div className="relative flex items-center justify-center">
                    <p className="text-cyan-200 text-xs sm:text-sm text-center font-medium leading-relaxed">
                      <span className="text-cyan-300 font-semibold">💡 Tip: </span>
                      <GamePlayTip />
                    </p>
                  </div>
                </div>
              </div>
            </Box>

            <motion.div
              className="relative"
              style={{ width: `${GRID_SIZE}px`, height: `${GRID_SIZE}px` }}
              animate={earthquakeActive ? {
                x: [0, -5, 5, -5, 5, -3, 3, -2, 2, 0],
                y: [0, -3, 3, -3, 3, -2, 2, -1, 1, 0],
                rotate: [0, -1, 1, -1, 1, 0],
              } : {}}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <AnimatePresence>
                {showPowerupAnimation && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    initial={{ opacity: 0, scale: 0.5, y: 100 }}
                    animate={{ opacity: 1, scale: 1.2, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={Images.POWER_UP}
                      alt="Power Up"
                      className="w-32 h-32"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Praise Pop-ups */}
              <AnimatePresence>
                {praisePopups.map((popup) => (
                  <PraisePopUp key={popup.id} popup={popup} onEarthquake={triggerEarthquake} />
                ))}
              </AnimatePresence>
              <GameBoard
                tiles={tiles}
                boardSize={GRID_SIZE}
                rows={rows}
                cols={cols}
                spacing={SPACING}
                onMove={onMove}
                onMovePending={onMovePending}
                onMergePending={onMergePending}
                breakTile={breakTile}
                doubleTile={doubleTile}
                showFireworks={maxTile === 2048}
              />
            </motion.div>
            <ItemBar handleOpenItemModal={handleOpenItemModal} />
          </div>
        </Box>
        <TileView value={maxTile} />
      </motion.div>
    </ThemeProvider>
  );
};
