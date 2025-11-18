import React, { useEffect, useState } from "react";
import { Tabs } from "../../../../../components/Tab";
import { useAuthContext } from "../../../../../context";
import { useGameContext } from "../../../context/GameContext";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { GridTabPanel } from "./GridTabPanel";
import { ItemsTabPanel } from "./ItemsTabPanel";
import { ThemesTabPanel } from "./ThemesTabPanel";
import { Images } from "../../../../../assets/images";
import useLocalStorage from "../../Main/hooks/useLocalStorage";
import { IoGridOutline, IoHammer, IoColorPaletteOutline } from "react-icons/io5";

export const ShopView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useLocalStorage(
    "shop-selected-tab",
    "Grid"
  );
  const { user, handleUpdateUser, setUser } = useAuthContext();
  const { themes, setThemes, getThemes } = useGameContext();
  const { userBalance, getBalance, buyItemsWithGameTokens } = useWeb3Context();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThemes, setIsLoadingThemes] = useState(true);

  useEffect(() => {
    getBalance();
    setIsLoadingThemes(true);
    getThemes("premium", true)
      .then((data) => {
        setThemes(data);
      })
      .finally(() => {
        setIsLoadingThemes(false);
      });
  }, []);

  useEffect(() => {
    // Add the CSS rule for no-select
    const style = document.createElement("style");
    style.innerHTML = `
      .no-select {
        user-select: none !important;
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* User's coin balance display */}
      <div className="absolute top-12 right-14 flex items-center gap-2">
        <img src={Images.DWAT} className="w-6 h-6 rounded-full" />
        <span className="text-white font-bold text-2xl">{userBalance} DWAT</span>
      </div>

      <Tabs
        tabs={[
          { id: "Grid", label: "Grid", icon: IoGridOutline },
          { id: "Items", label: "Items", icon: IoHammer },
          { id: "Themes", label: "Themes", icon: IoColorPaletteOutline },
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        className="mb-4"
        tabsContainerClassName="text-white"
      />

      <div className="relative w-full h-[calc(100vh-180px)]">
        <GridTabPanel
          selectedTab={selectedTab}
          user={user}
          userBalance={Number(userBalance)}
          handleUpdateUser={handleUpdateUser}
          setUser={setUser}
          buyItemsWithGameTokens={buyItemsWithGameTokens}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <ItemsTabPanel
          selectedTab={selectedTab}
          user={user}
          userBalance={Number(userBalance)}
          handleUpdateUser={handleUpdateUser}
          setUser={setUser}
          buyItemsWithGameTokens={buyItemsWithGameTokens}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <ThemesTabPanel
          selectedTab={selectedTab}
          themes={themes}
          isLoadingThemes={isLoadingThemes}
        />
      </div>
    </>
  );
};
