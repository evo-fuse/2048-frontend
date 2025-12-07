import React from "react";

interface CreateThemeButtonProps {
  onClick: () => void;
}

export const CreateThemeButton: React.FC<CreateThemeButtonProps> = ({ onClick }) => (
  <div
    className="flex flex-col gap-2 items-center justify-center hover:opacity-90 transition-opacity"
    onClick={onClick}
  >
    <div className="w-32 h-32 border-dotted border-4 border-cyan-500 rounded-lg flex items-center justify-center group hover:bg-cyan-500/10 transition-colors">
      <span className="text-cyan-500 text-7xl group-hover:text-cyan-500/80 transition-colors">
        +
      </span>
    </div>
    <span className="text-white/80 hover:text-white transition-colors">
      Upload Theme
    </span>
  </div>
); 