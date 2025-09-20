import { FC, useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import Box from "./components/Box";
import Control from "./components/Control/Control";
import GameBoard from "./components/GameBoard";
import ScoreBoard from "./components/ScoreBoard";
import Text from "./components/Text";
import ThemeSkeleton from "./components/Skeleton";
import { PreloadingModal } from "./components/Modal";
import useGameBoard from "./hooks/useGameBoard";
import useGameScore from "./hooks/useGameScore";
import useGameState, { GameStatus } from "./hooks/useGameState";
import useScaleControl from "./hooks/useScaleControl";
import { GRID_SIZE, MIN_SCALE, SPACING } from "./utils/constants";
import useLocalStorage from "./hooks/useLocalStorage";
import { ThemeName } from "./themes/types";
import useTheme from "./hooks/useTheme";
import { canGameContinue, isWin } from "./utils/rules";
import { useGameContext } from "./context/GameContext";
import { preloadThemeImages } from "./utils/imagePreloader";

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = "react-2048";

const App: FC = () => {
  const [gameState, setGameStatus] = useGameState({
    status: "running",
    pause: false,
  });
  
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);
  const [isPreloadingImages, setIsPreloadingImages] = useState(false);
  const [preloadingTheme, setPreloadingTheme] = useState<any>(null);

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: "dark",
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [{ name: themeName, value: themeValue }] = useTheme(
    config.theme
  );

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  const { total, best, addScore, setTotal } = useGameScore(config.bestScore);

  const { tiles, grid, onMove, onMovePending, onMergePending } = useGameBoard({
    rows,
    cols,
    gameState,
    addScore,
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
    setGameStatus("restart");
  }, [rows, cols, setGameStatus]);

  useEffect(() => {
    setConfig({ rows, cols, bestScore: best, theme: themeName });
  }, [rows, cols, best, themeName, setConfig]);

  const { themes, getThemes, setThemes, selectedTheme, setSelectedTheme } =
    useGameContext();
    
  // Handle theme selection and preload images
  const handleThemeSelect = useCallback((theme: any) => {
    setIsPreloadingImages(true);
    setPreloadingTheme(theme);
    
    // Preload all images for the selected theme
    preloadThemeImages(theme)
      .then(() => {
        setSelectedTheme(theme);
        setIsPreloadingImages(false);
        setPreloadingTheme(null);
      })
      .catch(() => {
        // Even if preloading fails, still set the theme
        setSelectedTheme(theme);
        setIsPreloadingImages(false);
        setPreloadingTheme(null);
      });
  }, [setSelectedTheme]);

  // Fetch themes on component mount
  useEffect(() => {
    setIsLoadingThemes(true);
    getThemes()
      .then((data) => {
        console.log("data", data);
        setThemes(data);
        setIsLoadingThemes(false);
      })
      .catch((error) => {
        console.error("Failed to fetch themes:", error);
        setIsLoadingThemes(false);
      });
  }, []);

  return (
    <ThemeProvider theme={themeValue}>
      {/* Preloading Modal */}
      <PreloadingModal isOpen={isPreloadingImages} theme={preloadingTheme} />
      
      <Box
        justifyContent="center"
        inlineSize="100%"
        blockSize="100%"
        alignItems="start"
        borderRadius={0}
        gap="s10"
      >
        <div className="flex flex-col items-start justify-start h-full w-96 gap-4 pt-12 rounded-8px bg-backdrop">
          <Text
            fontSize={28}
            fontWeight="bold"
            color="primary"
            className="mb-4 text-center w-full border-b-2 border-secondary pb-2"
          >
            Available Themes
          </Text>
          <div className="flex flex-col w-full gap-3">
            {isLoadingThemes ? (
              <ThemeSkeleton count={5} />
            ) : (
              themes.map((theme) => (
                <div
                  key={theme.uuid}
                  className={`flex flex-row items-start justify-start gap-3 p-3 bg-tile2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-white/40 border-2 ${
                    selectedTheme?.uuid === theme.uuid
                      ? "border-white bg-white/20"
                      : "hover:border-white hover:bg-white/10"
                  } cursor-pointer w-full ${isPreloadingImages && selectedTheme?.uuid !== theme.uuid ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {/* Show loading indicator when this theme is being preloaded */}
                  {isPreloadingImages && selectedTheme?.uuid === theme.uuid && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg z-10">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  <img
                    src={theme[2].sm}
                    alt={theme.title}
                    className="max-w-20 max-h-20 rounded-md shadow-md object-cover"
                  />
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-bold text-white text-lg">{theme.title}</p>
                    <p className="text-sm text-white/80">
                      {theme[2].description?.slice(0, 100) + "..." ||
                        "Theme variant"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="pt-12">
        <Box
          justifyContent="center"
          flexDirection="column"
          inlineSize={`${GRID_SIZE}px`}
        >
          <Box
            inlineSize="100%"
            justifyContent="space-between"
            marginBlockStart="s2"
          >
            <Box>
              <Text fontSize={64} fontWeight="bold" color="primary">
                2048
              </Text>
            </Box>
            <Box justifyContent="center">
              <ScoreBoard total={total} title="score" />
              <ScoreBoard total={best} title="best" />
            </Box>
          </Box>
          <Box marginBlockStart="s2" marginBlockEnd="s6" inlineSize="100%">
            <Control
              rows={rows}
              cols={cols}
              onReset={onResetGame}
              onChangeRow={setRows}
              onChangeCol={setCols}
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
          <Box marginBlock="s4" justifyContent="center" flexDirection="column">
            <Text fontSize={16} as="p" color="primary">
              ✨ Theme list is added by users.
            </Text>
            <Text fontSize={16} as="p" color="primary" className="text-center">
              🕹️ If you want to add a theme, please contact me<br /> on Telegram @passion_007
            </Text>
          </Box>
        </Box>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default App;
