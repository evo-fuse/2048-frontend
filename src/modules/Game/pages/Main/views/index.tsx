import { FC, useCallback, useEffect, useMemo, useState } from "react";
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
import { canGameContinue, isWin } from "../utils/rules";
import { useUser } from "@clerk/clerk-react";
import { useGameContext } from "../../../context/GameContext";
import { AnimatePresence, motion } from "framer-motion";
import { Images } from "../../../../../assets/images";
import { ItemBar } from "../components/ItemBar/ItemBar";
import { useAuthContext } from "../../../../../context";
import { TileView } from "../components/TileView";
import { useOpen } from "../../../../../hooks";
import RewardModal from "../components/RewardModal";
import { ItemModal } from "../components/ItemModal";

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  currentScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = "react-2048";

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
  const {
    handleUser,
    setUser,
    handleGetWalletAddress,
  } = useAuthContext();
  const { isOpen, onOpen, onClose } = useOpen();
  const [pendingFunction, setPendingFunction] = useState<Function>(() => {});

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

  const { user } = useUser();

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: "dark",
    bestScore: 0,
    currentScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [initialTiles, setInitialTiles] = useLocalStorage<Tile[]>(
    `${user?.id}-initialTiles`,
    []              
  );

  const [_, setIndex] = useLocalStorage<number>("index", 0);

  const [{ name: themeName, value: themeValue }] = useTheme(config.theme);

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  const onChangeRows = useCallback(
    (value: number) => {
      onOpen();
      setPendingFunction(() => {
        return () => {
          setRows(value);
          setInitialSetup(true);
        };
      });
    },
    [setRows, setInitialSetup]
  );

  const onChangeCols = useCallback(
    (value: number) => {
      onOpen();
      setPendingFunction(() => {
        return () => {
          setCols(value);
          setInitialSetup(true);
        };
      });
    },
    [setCols, setInitialSetup]
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
  } else if (gameState.status === "running" && isWin(tiles)) {
    // setGameStatus("win");
  } else if (gameState.status !== "lost" && !canGameContinue(grid, tiles)) {
    setGameStatus("lost");
    onOpen();
    setPendingFunction(() => {
      return () => setGameStatus("restart");
    });
  }

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

  const handleOpenItemModal = (notice: string) => {
    onOpenItemModal();
    setItemModalNotice(notice);
  };

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
            <Box
              inlinesize="100%"
              justifycontent="space-between"
              marginblockstart="s2"
            >
              <Box>
                <img src={Images.DWAT_2048} alt="DWAT 2048" />
              </Box>
              <Box justifycontent="center">
                <ScoreBoard total={total} title="score" />
                <ScoreBoard total={best} title="best" />
              </Box>
            </Box>
            <Box marginblockstart="s2" marginblockend="s6" inlinesize="100%">
              <Control
                rows={rows}
                cols={cols}
                onReset={onResetGame}
                onChangeRow={onChangeRows}
                onChangeCol={onChangeCols}
              />
            </Box>

            <div className="relative">
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
              />
            </div>
            <ItemBar handleOpenItemModal={handleOpenItemModal} />
          </div>
        </Box>
        <TileView value={maxTile} />
      </motion.div>
    </ThemeProvider>
  );
};
