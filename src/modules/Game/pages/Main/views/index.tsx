import { FC, useCallback, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Box from "../components/Box";
import Control from "../components/Control/Control";
import GameBoard from "../components/GameBoard";
import ScoreBoard from "../components/ScoreBoard";
import Text from "../components/Text";
import useGameBoard, { Tile } from "../hooks/useGameBoard";
import useGameScore from "../hooks/useGameScore";
import useGameState, { GameStatus } from "../hooks/useGameState";
import useScaleControl from "../hooks/useScaleControl";
import { GRID_SIZE, MIN_SCALE, SPACING } from "../utils/constants";
import useLocalStorage from "../hooks/useLocalStorage";
import { ThemeName } from "../themes/types";
import useTheme from "../hooks/useTheme";
import { canGameContinue, isWin } from "../utils/rules";
import { useUser } from "@clerk/clerk-react";
import { useGameContext } from "../../../context/GameContext";
import { motion } from "framer-motion";

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = "react-2048";

export const MainView: FC = () => {
  const { initialSetup, setInitialSetup } = useGameContext();
  const [gameState, setGameStatus] = useGameState({
    status: "running",
    pause: false,
  });

  const { user } = useUser();

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: "dark",
    bestScore: 0,
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
      setRows(value);
      setInitialSetup(true);
    },
    [setRows, setInitialSetup]
  );

  const onChangeCols = useCallback(
    (value: number) => {
      setCols(value);
      setInitialSetup(true);
    },
    [setCols, setInitialSetup]
  );

  const { total, best, addScore, setTotal } = useGameScore(config.bestScore);

  const { tiles, grid, onMove, onMovePending, onMergePending } = useGameBoard({
    rows,
    cols,
    gameState,
    addScore,
    initialTiles,
  });

  const onResetGame = useCallback(() => {
    setGameStatus("restart");
  }, [setGameStatus]);

  const onCloseNotification = useCallback(
    (currentStatus: GameStatus) => {
      setGameStatus(currentStatus === "win" ? "continue" : "restart");
    },
    [setGameStatus]
  );

  if (gameState.status === "restart") {
    setTotal(0);
    setGameStatus("running");
  } else if (gameState.status === "running" && isWin(tiles)) {
    setGameStatus("win");
  } else if (gameState.status !== "lost" && !canGameContinue(grid, tiles)) {
    setGameStatus("lost");
  }

  useEffect(() => {
    if (initialSetup) {
      setGameStatus("restart");
      setInitialSetup(false);
    }
  }, [rows, cols, setGameStatus, initialSetup, setInitialSetup]);

  useEffect(() => {
    setConfig({ rows, cols, bestScore: best, theme: themeName });
  }, [rows, cols, best, themeName, setConfig]);

  useEffect(() => {
    setInitialTiles(tiles);
    setIndex(Math.max(...tiles.map((tile) => tile.index)) + 1);
  }, [setInitialTiles, tiles]);

  return (
    <ThemeProvider theme={themeValue}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center w-full h-full items-center"
      >
        <Box
          justifycontent="center"
          inlinesize="100%"
          blocksize="100%"
          alignitems="center"
          borderradius={0}
        >
          <Box
            justifycontent="center"
            flexdirection="column"
            inlinesize={`${GRID_SIZE}px`}
          >
            <Box
              inlinesize="100%"
              justifycontent="space-between"
              marginblockstart="s2"
            >
              <Box>
                <Text fontSize={64} fontWeight="bold" color="primary">
                  DWAT 2048
                </Text>
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
            <GameBoard
              tiles={tiles}
              boardSize={GRID_SIZE}
              rows={rows}
              cols={cols}
              spacing={SPACING}
              gameStatus={gameState.status}
              onMove={onMove}
              onMovePending={onMovePending}
              onMergePending={onMergePending}
              onCloseNotification={onCloseNotification}
            />
          </Box>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};
