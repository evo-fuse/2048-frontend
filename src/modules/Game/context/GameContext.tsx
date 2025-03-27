import { createContext, useState, useContext } from "react";
import api from "../../../utils/api";
import { Theme } from "../../../types";
import { useOpen } from "../../../hooks";

interface GameContextType {
  initialSetup: boolean;
  setInitialSetup: (value: boolean) => void;
  themes: Theme[];
  showPowerupAnimation: boolean;
  setShowPowerupAnimation: (value: boolean) => void;
  powerup: number;
  setPowerup: (value: number) => void;
  handleBuyTheme: (themeId: string, txData: any) => Promise<void>;
  selectedTheme: Theme | "Basic";
  setSelectedTheme: (value: Theme | "Basic") => void;
  getThemes: () => Promise<Theme[]>;
  setThemes: (value: Theme[]) => void;
  isOpenWalletConnect: boolean;
  onOpenWalletConnect: () => void;
  onCloseWalletConnect: () => void;
}

const GameContext = createContext<GameContextType>({
  initialSetup: true,
  setInitialSetup: () => {},
  themes: [],
  showPowerupAnimation: false,
  setShowPowerupAnimation: () => {},
  powerup: 0,
  setPowerup: () => {},
  handleBuyTheme: () => Promise.resolve(),
  selectedTheme: "Basic",
  setSelectedTheme: () => {},
  getThemes: () => Promise.resolve([]),
  setThemes: () => {},
  isOpenWalletConnect: false,
  onOpenWalletConnect: () => {},
  onCloseWalletConnect: () => {},
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialSetup, setInitialSetup] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showPowerupAnimation, setShowPowerupAnimation] = useState(false);
  const [powerup, setPowerup] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<Theme | "Basic">("Basic");
  const {
    isOpen: isOpenWalletConnect,
    onOpen: onOpenWalletConnect,
    onClose: onCloseWalletConnect,
  } = useOpen(false);

  const getThemes = async () => {
    const { data } = await api({}).get("/themes");
    return data;
  };

  const buyTheme = async (themeId: string, txData: any) => {
    const { data } = await api({}).post(`/themes/buy`, { themeId, txData });
    return data;
  };

  const handleBuyTheme = async (themeId: string, txData: any) => {
    try {
      await buyTheme(themeId, txData);
      setThemes(
        themes.map((theme) =>
          theme.uuid === themeId ? { ...theme, owned: true } : theme
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    initialSetup,
    setInitialSetup,
    themes,
    setThemes,
    getThemes,
    showPowerupAnimation,
    setShowPowerupAnimation,
    powerup,
    setPowerup,
    handleBuyTheme,
    selectedTheme,
    setSelectedTheme,
    isOpenWalletConnect,
    onOpenWalletConnect,
    onCloseWalletConnect,
  };

  return (
    <GameContext.Provider value={{ ...value }}>{children}</GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
