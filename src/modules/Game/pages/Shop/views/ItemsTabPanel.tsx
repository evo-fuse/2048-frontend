import React, { useMemo, useState } from "react";
import { TabPanel } from "../../../../../components/Tab";
import { FaSpinner } from "react-icons/fa";
import { ShopItem } from "../components";
import { Images } from "../../../../../assets/images";
import { User } from "../../../../../types";
import { useAuthContext } from "../../../../../context";
import { useGameContext } from "../../../context/GameContext";

interface ItemsTabPanelProps {
  selectedTab: string;
  user: User | null;
  userBalance: number;
  handleUpdateUser: (data: any) => Promise<void>;
  setUser: (user: User) => void;
  buyItemsWithGameTokens: (amount: number) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const ItemsTabPanel: React.FC<ItemsTabPanelProps> = ({
  selectedTab,
  user,
  userBalance,
  handleUpdateUser,
  setUser,
  buyItemsWithGameTokens,
  isLoading,
  setIsLoading,
}) => {
  const { privateKey } = useAuthContext();
  const { onOpenWalletConnect } = useGameContext();
  const [items, setItems] = useState({
    hammer: 0,
    powerup: 0,
    upgrade: 0,
  });

  const totalCost = useMemo(() => {
    return items.hammer * 50 + items.powerup * 150 + items.upgrade * 200;
  }, [items]);

  const handleItemQuantityChange = (
    itemName: keyof typeof items,
    quantity: number
  ) => {
    setItems({
      ...items,
      [itemName]: quantity,
    });
  };

  const handlePurchaseItems = async () => {
    if(!privateKey) {
      onOpenWalletConnect();
      return;
    }
    setIsLoading(true);
    try {
      if (totalCost > userBalance || !user) return;
      await buyItemsWithGameTokens(totalCost);
      const updateItems = {
        hammer: user?.hammer + items.hammer,
        powerup: user?.powerup + items.powerup,
        upgrade: user?.upgrade + items.upgrade,
      };
      await handleUpdateUser({
        ...updateItems,
      });
      setUser({ ...user, ...updateItems });
      setItems({ hammer: 0, powerup: 0, upgrade: 0 });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabPanel
      id="Items"
      selectedTab={selectedTab}
      className="w-[480px] px-2"
    >
      <div className="w-full h-full flex flex-col gap-2 px-4 py-2">
        <div className="w-full flex flex-col gap-5">
          {/* Hammers Section */}
          <ShopItem
            icon={<img src={Images.HAMMER} alt="Hammer" className="w-16" />}
            title="Hammers"
            price={50}
            description="Break any tile on the grid to create new opportunities."
            quantity={items.hammer}
            onQuantityChange={(quantity) =>
              handleItemQuantityChange("hammer", quantity)
            }
          />

          {/* Upgrades Section */}
          <ShopItem
            icon={
              <img src={Images.UPGRADE} alt="Upgrade" className="w-16" />
            }
            title="Tile Upgrade"
            price={200}
            description="Increase your tile size for faster conquering."
            quantity={items.upgrade}
            onQuantityChange={(quantity) =>
              handleItemQuantityChange("upgrade", quantity)
            }
          />

          {/* Power-ups Section */}
          <ShopItem
            icon={
              <img src={Images.POWER_UP} alt="Power-up" className="w-16" />
            }
            title="Power Boost"
            price={150}
            description="Temporarily increase your scoring multiplier."
            quantity={items.powerup}
            onQuantityChange={(quantity) =>
              handleItemQuantityChange("powerup", quantity)
            }
          />

          {/* Checkout Section */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-gray-800/40 p-3 rounded-md">
              <span className="text-white font-bold">Total Cost:</span>
              <span className="text-white font-bold">{totalCost} dwat</span>
            </div>
            <button
              className="cursor-none bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-md transition-colors disabled:bg-gray-700 disabled:opacity-50"
              disabled={totalCost === 0 || totalCost > userBalance || isLoading}
              onClick={handlePurchaseItems}
            >
              {isLoading ? (
                <div className="w-full flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Purchasing...
                </div>
              ) : (
                "Purchase Items"
              )}
            </button>
          </div>
        </div>
      </div>
    </TabPanel>
  );
}; 