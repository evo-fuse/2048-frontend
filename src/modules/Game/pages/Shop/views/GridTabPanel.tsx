import React, { useState } from "react";
import { TabPanel } from "../../../../../components/Tab";
import { FaArrowRight } from "react-icons/fa";
import { GridUpgradeItem, PurchaseSuccessModal } from "../components";
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
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [gridUpgradeInfo, setGridUpgradeInfo] = useState({ oldSize: "", newSize: "" });

  const handleBuyGrid = async () => {
    try {
      setIsLoading(true);
      const price = 2 ** ((user?.cols || 4) + 1) * 100;

      if (!user || userBalance < price) {
        return;
      }

      await buyItemsWithGameTokens(price);

      const oldCols = user.cols || 4;
      const oldRows = user.rows || 4;
      const newCols = oldCols + 1;
      const newRows = oldRows + 1;
      await handleUpdateUser({
        cols: newCols,
        rows: newRows,
      });
      setUser({
        ...user,
        cols: newCols,
        rows: newRows,
      });

      setGridUpgradeInfo({
        oldSize: `${oldRows}x${oldCols}`,
        newSize: `${newRows}x${newCols}`,
      });
      setIsSuccessModalOpen(true);
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
      className="w-full"
    >
      <div className="w-full h-full flex flex-col gap-4 overflow-auto">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-3 3xs:gap-3.5 xs:gap-4 sm:gap-4 md:gap-4 lg:gap-4">
          {/* Grid Columns Upgrade */}
          <GridUpgradeItem
            icon={
              <FaArrowRight className="absolute text-white w-5 h-5 3xs:w-6 3xs:h-6 2xs:w-7 2xs:h-7 xs:w-7 xs:h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-7 lg:h-7 rotate-45" />
            }
            title="Expand Grid Size"
            price={2 ** ((user?.cols || 4) + 1) * 100}
            currentValue={gridCols}
            description="Add an additional column to your game grid."
            onUpgrade={handleBuyGrid}
            userBalance={Number(userBalance)}
            gridRows={gridRows}
            gridCols={gridCols}
            loading={isLoading}
          />
        </div>
      </div>

      <PurchaseSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Grid Upgraded Successfully!"
        gridInfo={gridUpgradeInfo}
      />
    </TabPanel>
  );
}; 