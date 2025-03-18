import React, { useMemo, useState } from "react";
import { TabPanel, Tabs } from "../../../../../components/Tab";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { useAuthContext } from "../../../../../context";
import { ShopItem, GridUpgradeItem } from "../components";
import { useGameContext } from "../../../context/GameContext";
export const ShopView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("Grid");
  const { user } = useAuthContext();
  const { themes } = useGameContext();
  const userBalance = 10000; // This should come from user data

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

  const handleBuyGridCols = () => {
    const price = 2 ** ((user?.cols || 4) + 1) * 100;

    if (!user || userBalance < price) {
      return;
    }

    // Update user data
    // updateUser({
    //   ...user,
    //   cols: (user.cols || 4) + 1,
    //   dwat: userBalance - price
    // });
  };

  const handleBuyGridRows = () => {
    const price = 2 ** ((user?.rows || 4) + 1) * 100;

    if (!user || userBalance < price) {
      return;
    }

    // Update user data
    // updateUser({
    //   ...user,
    //   rows: (user.rows || 4) + 1,
    //   dwat: userBalance - price
    // });
  };

  const handlePurchaseItems = () => {
    if (totalCost > userBalance) return;

    // Process purchase logic here
    // updateUser({
    //   ...user,
    //   dwat: userBalance - totalCost,
    //   items: {
    //     ...user.items,
    //     hammer: (user.items?.hammer || 0) + items.hammer,
    //     powerup: (user.items?.powerup || 0) + items.powerup,
    //     upgrade: (user.items?.upgrade || 0) + items.upgrade,
    //   }
    // });

    // Reset items
    setItems({ hammer: 0, powerup: 0, upgrade: 0 });
  };

  const gridRows = user?.rows || 4;
  const gridCols = user?.cols || 4;

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center py-8">
      <div className="w-[480px] h-full overflow-hidden bg-black/20 border border-white/10 rounded-lg">
        {/* User's coin balance display */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Shop</h2>
          <div className="flex items-center gap-2">
            <span>💰</span>
            <span className="text-white font-bold">{userBalance} DWA</span>
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

        <TabPanel
          id="Grid"
          selectedTab={selectedTab}
          className="w-[480px] px-2"
        >
          <div className="w-full h-full flex flex-col gap-2 px-4 py-2">
            <div className="w-full flex flex-col gap-6">
              {/* Grid Columns Upgrade */}
              <GridUpgradeItem
                icon={
                  <FaArrowRight className="absolute text-white" size={36} />
                }
                title="Grid Columns"
                price={2 ** ((user?.cols || 4) + 1) * 100}
                currentValue={gridCols}
                description="Add an additional column to your game grid."
                onUpgrade={handleBuyGridCols}
                userBalance={userBalance}
                gridRows={gridRows}
                gridCols={gridCols}
              />

              {/* Grid Rows Upgrade */}
              <GridUpgradeItem
                icon={<FaArrowDown className="absolute text-white" size={36} />}
                title="Grid Rows"
                price={2 ** ((user?.rows || 4) + 1) * 100}
                currentValue={gridRows}
                description="Add an additional row to your game grid."
                onUpgrade={handleBuyGridRows}
                userBalance={userBalance}
                gridRows={gridRows}
                gridCols={gridCols}
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel
          id="Items"
          selectedTab={selectedTab}
          className="w-[480px] px-2"
        >
          <div className="w-full h-full flex flex-col gap-2 px-4 py-2">
            <div className="w-full flex flex-col gap-6">
              {/* Hammers Section */}
              <ShopItem
                icon="🔨"
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
                icon="⚡"
                title="Speed Upgrade"
                price={200}
                description="Increase your movement speed for faster gameplay."
                quantity={items.upgrade}
                onQuantityChange={(quantity) =>
                  handleItemQuantityChange("upgrade", quantity)
                }
              />

              {/* Power-ups Section */}
              <ShopItem
                icon="🔥"
                title="Power Boost"
                price={150}
                description="Temporarily increase your scoring multiplier."
                quantity={items.powerup}
                onQuantityChange={(quantity) =>
                  handleItemQuantityChange("powerup", quantity)
                }
              />

              {/* Checkout Section */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center bg-gray-800/40 p-3 rounded-md">
                  <span className="text-white font-bold">Total Cost:</span>
                  <span className="text-white font-bold">{totalCost} dwat</span>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-md transition-colors disabled:bg-gray-700 disabled:opacity-50"
                  disabled={totalCost === 0 || totalCost > userBalance}
                  onClick={handlePurchaseItems}
                >
                  Purchase Items
                </button>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel
          id="Themes"
          selectedTab={selectedTab}
          className="w-[480px] px-2"
        >
          <div className="w-full h-[700px] overflow-y-auto overflow-x-hidden flex flex-col gap-6 px-4 py-2">
            {themes.map((theme) => (
              <div
                key={theme.uuid}
                className="relative w-full flex gap-3 bg-gray-800/40 p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all"
              >
                <div className="min-w-[80px] h-[80px] bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={theme[2].sm}
                    alt={theme.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-white text-xl font-bold">
                    {theme.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{theme.description}</p>
                  <div className="w-full flex justify-end mt-auto">
                    <button className="max-w-min text-nowrap bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-md transition-colors">
                      Buy 1.99$
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      </div>
    </div>
  );
};
