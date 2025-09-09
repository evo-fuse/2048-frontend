import { createContext, useState, useContext } from "react";
import api from "../../../utils/api";
import { Theme } from "../../../types";
import { useOpen } from "../../../hooks";
import useLocalStorage from "../pages/Main/hooks/useLocalStorage";

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
  getThemes: (visibility?: string, privateVisibility?: boolean) => Promise<Theme[]>;
  setThemes: (value: Theme[]) => void;
  isOpenWalletConnect: boolean;
  onOpenWalletConnect: () => void;
  onCloseWalletConnect: () => void;
  itemUsage: { powerup: boolean; upgrade: boolean };
  setItemUsage: (value: { powerup: boolean; upgrade: boolean }) => void;
  isOpenItemModal: boolean;
  onOpenItemModal: () => void;
  onCloseItemModal: () => void;
  itemModalNotice: string;
  setItemModalNotice: (value: string) => void;
  fireworksState: boolean;
  setFireworksState: (value: boolean) => void;
  createdThemes: Theme[];
  setCreatedThemes: (value: Theme[]) => void;
  getCreatedThemes: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialSetup, setInitialSetup] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [createdThemes, setCreatedThemes] = useState<Theme[]>([]);
  const [showPowerupAnimation, setShowPowerupAnimation] = useState(false);
  const [powerup, setPowerup] = useState<number>(0);
  const [selectedTheme, setSelectedTheme] = useState<Theme | "Basic">("Basic");
  const {
    isOpen: isOpenWalletConnect,
    onOpen: onOpenWalletConnect,
    onClose: onCloseWalletConnect,
  } = useOpen(false);
  const [itemModalNotice, setItemModalNotice] = useState<string>("");
  const [fireworksState, setFireworksState] = useState(false);

  const [itemUsage, setItemUsage] = useLocalStorage<{
    powerup: boolean;
    upgrade: boolean;
  }>("itemUsage", { powerup: false, upgrade: false });

  const {
    isOpen: isOpenItemModal,
    onOpen: onOpenItemModal,
    onClose: onCloseItemModal,
  } = useOpen();

  const getThemes = async (visibility: string = "all", authorized: boolean = false) => {
    setThemes([]);
    const auth = localStorage.getItem("token") ? "private" : authorized ? "public" : "private";
    const { data } = await api({}).get(`/themes/${auth}/${visibility}`);
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

  const getCreatedThemes = async () => {
    const { data } = await api({}).post(`/themes/created`);
    setCreatedThemes(data);
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
    itemUsage,
    setItemUsage,
    isOpenItemModal,
    onOpenItemModal,
    onCloseItemModal,
    itemModalNotice,
    setItemModalNotice,
    fireworksState,
    setFireworksState,
    createdThemes,
    setCreatedThemes,
    getCreatedThemes,
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
