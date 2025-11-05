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
  const [selectedTheme, setSelectedTheme] = useState<Theme | "Basic">({
    uuid: "9fe2b96a-e9db-11ef-9ca5-047c16279a0c",
    title: "Evolving History 2048",
    description: "Evolving History 2048 is a strategic puzzle game where players merge numbered tiles to reach 2048, featuring various historical themes that enhance the gameplay experience.",
    2: {"lg": "https://i.ibb.co/C5qWgH20/2.png", "sm": "https://i.ibb.co/PzjpB3XT/2.png", "title": "Prehistoric Era", "description": "The Prehistoric Era marks the dawn of human existence, characterized by the development of stone tools and the emergence of early societies. This period laid the foundation for cultural and technological advancements that would shape future civilizations."},
    4: {"lg": "https://i.ibb.co/NnV4D9Cm/4.png", "sm": "https://i.ibb.co/Qj9Bg6sm/4.png", "title": "Agricultural Revolution", "description": "The Agricultural Revolution transformed human life as communities shifted from nomadic hunting and gathering to settled farming. This pivotal change allowed for population growth and the establishment of permanent settlements, leading to the rise of complex societies."},
    8: {"lg": "https://i.ibb.co/Y4gL9GDz/8.png", "sm": "https://i.ibb.co/5XLZDxN7/8.png", "title": "Formation of Cities", "description": "The Formation of Cities marked a significant leap in human organization, where agricultural surplus enabled the development of urban centers. These cities became hubs of trade, culture, and governance, fostering innovation and social complexity."},
    16: {"lg": "https://i.ibb.co/hx0NHKQd/16.png", "sm": "https://i.ibb.co/93kZppQh/16.png", "title": "Classical Civilizations", "description": "Classical Civilizations, such as Greece and Rome, showcased remarkable advancements in philosophy, art, and governance. This era was defined by the pursuit of knowledge, the establishment of democratic principles, and the expansion of empires."},
    32: {"lg": "https://i.ibb.co/DFxQpsF/32.png", "sm": "https://i.ibb.co/kVqg8KB8/32.png", "title": "Middle Ages", "description": "The Middle Ages, often referred to as the Dark Ages, was a time of feudalism and the rise of the church influence in Europe. Despite challenges, this period also saw the preservation of knowledge and the beginnings of the Renaissance."},
    64: {"lg": "https://i.ibb.co/wr3YQZK0/64.png", "sm": "https://i.ibb.co/3ZRcwbq/64.png", "title": "Renaissance", "description": "The Renaissance was a vibrant period of rebirth in art, culture, and science, inspired by the classical antiquity. It fostered creativity and innovation, leading to groundbreaking discoveries and masterpieces that continue to influence the world today."},
    128: {"lg": "https://i.ibb.co/Y7k9SZp7/128.png", "sm": "https://i.ibb.co/27Np1b20/128.png", "title": "Industrial Revolution", "description": "The Industrial Revolution marked a monumental shift from agrarian economies to industrialized societies, driven by technological advancements. This era revolutionized production methods, transportation, and urbanization, profoundly impacting daily life."},
    256: {"lg": "https://i.ibb.co/6JsJ11t0/256.png", "sm": "https://i.ibb.co/nNf2rHsm/256.png", "title": "World War", "description": "The World Wars were defining conflicts of the 20th century, reshaping global politics and society. These wars brought unprecedented destruction but also led to significant advancements in technology and a reevaluation of international relations."},
    512: {"lg": "https://i.ibb.co/dwPXk7QV/512.png", "sm": "https://i.ibb.co/5x95cj2g/512.png", "title": "Cold War Era", "description": "The Cold War Era was characterized by geopolitical tension between the Soviet Union and the United States, influencing global alliances and conflicts. This period saw the proliferation of nuclear weapons and a race for technological supremacy."},
    1024: {"lg": "https://i.ibb.co/jX9xvTX/1024.png", "sm": "https://i.ibb.co/hFgWxdZZ/1024.png", "title": "Digital Revolution", "description": "The Digital Revolution transformed how we communicate, work, and live, driven by the rise of computers and the internet. This era has connected the world in unprecedented ways, fostering innovation and reshaping economies."},
    2048: {"lg": "https://i.ibb.co/r22ySFr3/2048.png", "sm": "https://i.ibb.co/GQjLRg9z/2048.png", "title": "Climate Change Awareness", "description": "The era of Climate Change Awareness has brought global attention to environmental issues and the urgent need for sustainable practices. This movement emphasizes the importance of protecting our planet for future generations."},
    4096: {"lg": "https://i.ibb.co/mVHKHZFy/4096.png", "sm": "https://i.ibb.co/xthqsnWp/4096.png", "title": "Cutting Edge Era", "description": "The Cutting Edge Era represents the pinnacle of human achievement, where technology and innovation push the boundaries of what is possible. This era is defined by groundbreaking discoveries and advancements that shape our future."},
    8192: {"lg": "https://i.ibb.co/Wp0THY8x/8192.png", "sm": "https://i.ibb.co/YF1wjYZ6/8192.png", "title": "Future Prospects", "description": "The Future Prospects era envisions a world shaped by advancements in science, technology, and sustainability for a better future."},
    visibility: "public",
    numberDisplay: false,
    position: "center",
    numberColor: "#ffffff",
    numberSize: 24,
    owned: true,
    creator_id: "0x4B4158Bcf3267b6f8F389171D6365F46516CD34D"
  });
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
