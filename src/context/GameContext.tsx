import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageTheme } from '../themes/types';
import api from '../utils/api';
import { Location } from '../hooks/useGameBoard';


export enum Item {
  NONE = 'none',
  BREAK = 'break',
  UPGRADE = 'upgrade',
  SWAP = 'swap',
}

interface GameContextType {
    themes: ImageTheme[];
    setThemes: (themes: ImageTheme[]) => void;
    getThemes: () => Promise<ImageTheme[]>;
    selectedTheme: ImageTheme | null;
    setSelectedTheme: (theme: ImageTheme) => void;
    item: Item;
    setItem: (item: Item) => void;
    swapTile: Location | null;
    setSwapTile: (swapTile: Location | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [themes, setThemes] = useState<ImageTheme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ImageTheme | null>(null);
  const getThemes = async () => {
    const [premiumResponse, publicResponse] = await Promise.all([
      api({}).get('/themes/public/premium'),
      api({}).get('/themes/public/public')
    ]);
    
    const data = [...premiumResponse.data, ...publicResponse.data];
    return data;
  };
  const [item, setItem] = useState<Item>(Item.NONE);
  const [swapTile, setSwapTile] = useState<Location | null>(null);

  const value = {
    themes,
    setThemes,
    getThemes,
    selectedTheme,
    setSelectedTheme,
    item,
    setItem,
    swapTile,
    setSwapTile,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
