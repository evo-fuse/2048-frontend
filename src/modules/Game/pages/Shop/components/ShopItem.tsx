import React from "react";

interface ShopItemProps {
  icon: React.ReactNode;
  title: string;
  price: number;
  description: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export const ShopItem: React.FC<ShopItemProps> = ({
  icon,
  title,
  price,
  description,
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-400/20">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h4 className="text-xl font-bold text-white">{title}</h4>
        </div>
        <div className="text-white font-bold">{price} DWAT</div>
      </div>
      <p className="text-gray-300 text-sm mb-3">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white">Quantity:</span>
          <div className="flex items-center bg-cyan-800 rounded-md">
            <button
              className="px-2 py-1 text-white hover:bg-cyan-700 rounded-l-md"
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            >
              -
            </button>
            <input
              type="text"
              className="w-12 bg-transparent text-center text-white border-0"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                onQuantityChange(value);
              }}
            />
            <button
              className="px-2 py-1 text-white hover:bg-cyan-700 rounded-r-md"
              onClick={() => onQuantityChange(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="text-white">Total: {quantity * price} dwat</div>
      </div>
    </div>
  );
}; 