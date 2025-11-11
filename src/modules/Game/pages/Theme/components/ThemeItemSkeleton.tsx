import React from "react";

export const ThemeItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <div className="relative">
        <div className="w-32 h-32 bg-white/10 rounded-lg animate-pulse shadow-md" />
      </div>
      <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
    </div>
  );
};

