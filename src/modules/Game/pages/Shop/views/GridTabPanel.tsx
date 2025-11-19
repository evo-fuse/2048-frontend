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

      // Set grid info for modal
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
        <div className="w-full flex flex-col gap-6">
          {/* Grid Columns Upgrade */}
          <GridUpgradeItem
            icon={
              <FaArrowRight className="absolute text-white rotate-45" size={36} />
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