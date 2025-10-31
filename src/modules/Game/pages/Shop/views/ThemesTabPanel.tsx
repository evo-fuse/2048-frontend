import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TabPanel } from "../../../../../components/Tab";
import { Theme } from "../../../../../types";
import { CheckoutModal } from "../components";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { useGameContext } from "../../../context/GameContext";
import { CONFIG } from "../../../../../const";
import { Ribbon } from "../../../../../components";
import useLocalStorage from "../../Main/hooks/useLocalStorage";

interface ThemesTabPanelProps {
  selectedTab: string;
  themes: Theme[];
}

export const ThemesTabPanel: React.FC<ThemesTabPanelProps> = ({
  selectedTab,
  themes,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useLocalStorage(
    "theme-checkout-modal-open",
    false
  );
  const [selectedThemeId, setSelectedThemeId] = useLocalStorage(
    "theme-checkout-selected-theme",
    ""
  );
  const selectedTheme = selectedThemeId
    ? themes.find((theme) => theme.uuid === selectedThemeId) || null
    : null;
  const { buyThemesWithUSD } = useWeb3Context();
  const { handleBuyTheme } = useGameContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyClick = (theme: Theme) => {
    setSelectedThemeId(theme.uuid);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false);
    setSelectedThemeId("");
  };

  const handlePurchase = async (tokenType: string) => {
    const network = {
      busdt: { token: "usdt", network: "binance" },
      busdc: { token: "usdc", network: "binance" },
      ausdt: { token: "usdt", network: "arbitrum" },
      ausdc: { token: "usdc", network: "arbitrum" },
      pusdt: { token: "usdt", network: "polygon" },
      pusdc: { token: "usdc", network: "polygon" },
    };
    if (!selectedTheme) return;
    setIsLoading(true);
    try {
      const data = await buyThemesWithUSD(
        tokenType,
        Number(selectedTheme.price) * 100,
        selectedTheme.creator_id
      );
      console.log("data", data);
      await handleBuyTheme(selectedTheme.uuid, {
        txHash: data.transactionHash,
        tokenType: network[tokenType as keyof typeof network].token,
        amount:
          selectedTheme.creator_id === CONFIG.RECEIVER_ADDRESS
            ? selectedTheme.price
            : (selectedTheme.price || 0) * 0.1,
        network: network[tokenType as keyof typeof network].network,
        fromAddr: data.from,
        toAddr: CONFIG.RECEIVER_ADDRESS,
      });
      handleCheckoutClose();
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TabPanel id="Themes" selectedTab={selectedTab} className="w-full px-2">
        <div
          ref={scrollRef}
          className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col gap-6 px-4 py-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {themes.map((theme) => (
            <motion.div
              key={theme.uuid}
              className="relative w-full flex gap-3 bg-gray-800/40 p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: "auto" }}
            >
              <div className="min-w-[128px] h-[128px] bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={theme[2].sm}
                  alt={theme.title}
                  className="w-32 object-cover"
                  draggable="false"
                />
                {theme.owned && (
                  <Ribbon title="Purchased" color="blue" top={8} left={8} />
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-white text-xl font-bold">{theme.title}</h3>
                <p className="text-gray-300 text-sm">{theme.description}</p>
                {!theme.owned && (
                  <div className="w-full flex justify-end mt-auto">
                    <button
                      className="max-w-min text-nowrap bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-md transition-colors cursor-none"
                      onClick={() => handleBuyClick(theme)}
                    >
                      Buy {theme.price}$
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </TabPanel>

      {selectedTheme && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={handleCheckoutClose}
          theme={selectedTheme}
          onPurchase={handlePurchase}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
