import React from "react";

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
}) => {
  const canAfford = userBalance >= price;

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-bold text-white">{title}</h4>
        </div>
        <div className="text-white font-bold">{price} DWA</div>
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
            canAfford
              ? "bg-white/20 hover:bg-white/30"
              : "bg-gray-700"
          } 
            text-white rounded px-6 py-2 transition-colors font-bold`}
          onClick={onUpgrade}
          disabled={!canAfford}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}; 