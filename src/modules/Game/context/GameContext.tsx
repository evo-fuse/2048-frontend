import { createContext, useState, useContext, useEffect } from "react";
import api from "../../../utils/api";
import { Theme } from "../../../types";

type GameContextType = {
  initialSetup: boolean;
  setInitialSetup: (initialSetup: boolean) => void;
  themes: Theme[];
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined
);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialSetup, setInitialSetup] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);

  const getThemes = async () => {
    const { data } = await api({}).get("/themes");
    return data;
  };

  useEffect(() => {
    getThemes().then((data) => {
      setThemes([...data]);
    });
  }, []);

  const value = {
    initialSetup,
    setInitialSetup,
    themes,
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
