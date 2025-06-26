import React, { useEffect, useState } from "react";
import { Tabs } from "../../../../../components/Tab";
import { useAuthContext } from "../../../../../context";
import { useGameContext } from "../../../context/GameContext";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { GridTabPanel } from "./GridTabPanel";
import { ItemsTabPanel } from "./ItemsTabPanel";
import { ThemesTabPanel } from "./ThemesTabPanel";
import { Images } from "../../../../../assets/images";

export const ShopView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Grid");
  const { user, handleUpdateUser, setUser } = useAuthContext();
  const { themes, setThemes, getThemes } = useGameContext();
  const { userBalance, getBalance, buyItemsWithGameTokens } = useWeb3Context();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getBalance();
    getThemes("premium").then((data) => {
      setThemes(data);
    });
  }, []);

  useEffect(() => {
    // Add the CSS rule for no-select
    const style = document.createElement('style');
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
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center p-8">
      <div className="w-full h-full overflow-hidden bg-black/20 border border-white/10 rounded-lg">
        {/* User's coin balance display */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Shop</h2>
          <div className="flex items-center gap-2">
            <img src={Images.DWAT} className="w-6 h-6 rounded-full" />
            <span className="text-white font-bold">{userBalance} DWAT</span>
          </div>
        </div>

        <Tabs
          tabs={[
            { id: "Grid", label: "Grid" },
            { id: "Items", label: "Items" },
            { id: "Themes", label: "Themes" },
          ]}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          className="mb-4"
          tabsContainerClassName="border-b border-gray-200 text-white"
        />

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
        />
      </div>
    </div>
  );
};
