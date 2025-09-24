import React from "react";
import { TabPanel } from "../../../../../components/Tab";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import { GridUpgradeItem } from "../components";
import { User } from "../../../../../types";

interface GridTabPanelProps {
  selectedTab: string;
  user: User | null;
  userBalance: number;
  handleUpdateUser: (data: any) => Promise<void>;
  setUser: (user: User) => void;
  buyItemsWithGameTokens: (amount: number) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const GridTabPanel: React.FC<GridTabPanelProps> = ({
  selectedTab,
  user,
  userBalance,
  handleUpdateUser,
  setUser,
  buyItemsWithGameTokens,
  isLoading,
  setIsLoading,
}) => {
  const gridRows = user?.rows || 4;
  const gridCols = user?.cols || 4;

  const handleBuyGridCols = async () => {
    try {
      setIsLoading(true);
      const price = 2 ** ((user?.cols || 4) + 1) * 100;

      if (!user || userBalance < price) {
        return;
      }

      await buyItemsWithGameTokens(price);
      await handleUpdateUser({
        cols: (user.cols || 4) + 1,
      });
      setUser({
        ...user,
        cols: (user.cols || 4) + 1,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyGridRows = async () => {
    try {
      setIsLoading(true);
      const price = 2 ** ((user?.rows || 4) + 1) * 100;

      if (!user || userBalance < price) {
        return;
      }

      await buyItemsWithGameTokens(price);
      await handleUpdateUser({
        rows: (user.rows || 4) + 1,
      });
      setUser({
        ...user,
        rows: (user.rows || 4) + 1,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabPanel
      id="Grid"
      selectedTab={selectedTab}
      className="w-full px-2"
    >
      <div className="w-full h-full flex flex-col gap-4 p-4 overflow-auto">
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
            userBalance={Number(userBalance)}
            gridRows={gridRows}
            gridCols={gridCols}
            loading={isLoading}
          />

          {/* Grid Rows Upgrade */}
          <GridUpgradeItem
            icon={<FaArrowDown className="absolute text-white" size={36} />}
            title="Grid Rows"
            price={2 ** ((user?.rows || 4) + 1) * 100}
            currentValue={gridRows}
            description="Add an additional row to your game grid."
            onUpgrade={handleBuyGridRows}
            userBalance={Number(userBalance)}
            gridRows={gridRows}
            gridCols={gridCols}
            loading={isLoading}
          />
        </div>
      </div>
    </TabPanel>
  );
}; 