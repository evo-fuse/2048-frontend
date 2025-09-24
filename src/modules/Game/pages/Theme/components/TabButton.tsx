import React from "react";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`text-2xl font-bold px-8 py-6 transition-colors ${
      active
        ? "text-[#EC9050] border-b-2 border-[#EC9050]"
        : "text-white/70 hover:text-white"
    }`}
  >
    {children}
  </button>
); 