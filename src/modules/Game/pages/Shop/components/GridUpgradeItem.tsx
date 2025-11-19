import React from "react";
import { FaSpinner } from "react-icons/fa";

interface GridUpgradeItemProps {
  icon: React.ReactNode;
  title: string;
  price: number;
  currentValue: number;
  description: string;
  onUpgrade: () => void;
  userBalance: number;
  gridRows: number;
  gridCols: number;
  loading: boolean;
}

export const GridUpgradeItem: React.FC<GridUpgradeItemProps> = ({
  icon,
  title,
  price,
  currentValue,
  description,
  onUpgrade,
  userBalance,
  gridRows,
  gridCols,
  loading,
}) => {
  const canAfford = userBalance >= price;

  return (
    <div className="w-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-bold text-white">{title}</h4>
        </div>
        <div className="text-white font-bold">{price} DWAT</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-gray-800 rounded-lg flex flex-col gap-1 p-2 items-center justify-center relative min-w-32 min-h-32 w-32 h-24">
          {icon}
          {Array.from({ length: gridRows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-row gap-1 w-full"
              style={{
                height: `${100 / gridRows}%`,
              }}
            >
              {Array.from({ length: gridCols }).map((_, colIndex) => (
                <div
                  key={`col-${colIndex}`}
                  className="h-full bg-gray-600 rounded"
                  style={{
                    width: `${100 / gridCols}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="text-gray-300">
          <p className="font-bold text-white">Current: {currentValue}</p>
          <p>{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          className={`${
            canAfford ? "bg-white/20 hover:bg-white/30" : "bg-white/30 opacity-50"
          } 
            text-white rounded px-6 py-2 transition-colors font-bold cursor-none`}
          onClick={onUpgrade}
          disabled={!canAfford}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <FaSpinner className="animate-spin" /> Loading...
            </div>
          ) : (
            "Upgrade"
          )}
        </button>
      </div>
    </div>
  );
};
