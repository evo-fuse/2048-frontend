import React from "react";
import { Theme } from "../../../../../types";

interface ThemeInfoSectionProps {
  theme: Theme;
}

export const ThemeInfoSection: React.FC<ThemeInfoSectionProps> = ({ theme }) => {
  return (
    <div className="flex items-center gap-4 bg-cyan-900/40 p-4 rounded-lg">
      <div className="min-w-[80px] h-[80px] bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={theme[2].sm}
          alt={theme.title}
          className="w-20 object-cover"
          draggable="false"
        />
      </div>
      <div>
        <h3 className="text-white text-base font-bold">{theme.title}</h3>
        <p className="text-white font-bold mt-2 text-sm">Price: {theme.price}$</p>
      </div>
    </div>
  );
};

