import React from "react";
import { FaSpinner } from "react-icons/fa";
import { IoExpand } from "react-icons/io5";

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
    <div className="w-full bg-gradient-to-br from-cyan-500/5 to-purple-500/5 backdrop-blur-sm rounded-lg 3xs:rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 3xs:p-3 xs:p-3.5 sm:p-4 md:p-4 lg:p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200">
      <div className="flex flex-col md:flex-row 2xs:flex-row justify-between items-start 2xs:items-center gap-2 3xs:gap-2.5 xs:gap-3 sm:gap-3.5 mb-2.5 3xs:mb-3 xs:mb-3 sm:mb-3 md:mb-3">
        <div className="flex items-center gap-2 3xs:gap-2 xs:gap-2 sm:gap-2">
          <h4 className="text-base 3xs:text-lg 2xs:text-lg xs:text-xl sm:text-xl md:text-xl lg:text-xl font-bold text-white">{title}</h4>
        </div>
        <div className="font-bold text-xs 3xs:text-sm 2xs:text-sm xs:text-base sm:text-base md:text-base lg:text-base whitespace-nowrap">{price === 51200 ? "" : <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">{price} DWAT</span>}</div>
      </div>

      <div className="flex flex-row items-start xs:items-center gap-3 3xs:gap-3.5 xs:gap-4 sm:gap-4 md:gap-4">
        <div className="bg-cyan-500/10 rounded-lg 3xs:rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-lg border border-cyan-500/30 flex flex-col gap-0.5 3xs:gap-1 p-1.5 3xs:p-2 xs:p-2 sm:p-2 md:p- items-center justify-center relative min-w-20 3xs:min-w-24 2xs:min-w-28 xs:min-w-32 sm:min-w-32 md:min-w-32 lg:min-w-32 min-h-24 3xs:min-h-24 2xs:min-h-28 xs:min-h-32 sm:min-h-32 md:min-h-32 lg:min-h-32 w-20 3xs:w-24 2xs:w-28 xs:w-32 sm:w-32 md:w-32 lg:w-32 h-20 3xs:h-24 2xs:h-28 xs:h-32 sm:h-32 md:h-32 lg:h-32 mx-auto xs:mx-0">
          {icon}
          {Array.from({ length: gridRows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="flex flex-row gap-0.5 3xs:gap-1 w-full"
              style={{
                height: `${100 / gridRows}%`,
              }}
            >
              {Array.from({ length: gridCols }).map((_, colIndex) => (
                <div
                  key={`col-${colIndex}`}
                  className="h-full bg-cyan-500/30 hover:bg-cyan-500/50 rounded-sm 3xs:rounded transition-colors"
                  style={{
                    width: `${100 / gridCols}%`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="text-gray-300 text-xs 3xs:text-xs 2xs:text-sm xs:text-sm sm:text-sm md:text-sm lg:text-sm flex-1">
          <p className="font-bold text-white text-sm 3xs:text-sm 2xs:text-base xs:text-base sm:text-base md:text-base lg:text-base mb-1">Current: {currentValue}</p>
          <p className="leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-end mt-2.5 3xs:mt-3 xs:mt-3 sm:mt-3 md:mt-3">
        <button
          className={`${canAfford ? "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 active:from-cyan-700 active:to-cyan-800" : "bg-gray-700 opacity-50"
            } 
            text-white rounded-md 3xs:rounded-md xs:rounded-lg sm:rounded-lg md:rounded-xl px-3 3xs:px-3.5 xs:px-4 sm:px-5 md:px-6 lg:px-6 py-2 3xs:py-2 xs:py-2 sm:py-2 md:py-2 lg:py-2 transition-all duration-200 font-bold cursor-none text-xs 3xs:text-sm 2xs:text-sm xs:text-base sm:text-base md:text-base lg:text-base xl:text-base shadow-lg hover:shadow-cyan-500/50 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 touch-manipulation`}
          onClick={onUpgrade}
          disabled={!canAfford || loading || price === 51200}
        >
          {loading ? (
            <div className="flex items-center gap-2 3xs:gap-2.5 xs:gap-3 sm:gap-3.5">
              <FaSpinner className="animate-spin w-3 h-3 3xs:w-3.5 3xs:h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span className="text-xs 3xs:text-sm 2xs:text-sm xs:text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl">Loading...</span>
            </div>
          ) : price === 51200 ? (
            "Completed"
          ) : (
            <div className="flex items-center gap-1.5 3xs:gap-2 xs:gap-2 sm:gap-2">
              <span>Upgrade</span>
              <IoExpand className="w-3 h-3 3xs:w-3.5 3xs:h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-6 md:h-6" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
