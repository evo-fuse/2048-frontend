import React from 'react';

interface ThemeSkeletonProps {
  count?: number;
}

const ThemeSkeleton: React.FC<ThemeSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <div 
          key={`skeleton-${index}`}
          className="flex flex-row items-start justify-start gap-3 p-3 bg-tile2/30 rounded-lg shadow-lg animate-pulse border-white/10 border-2 w-full"
        >
          {/* Image skeleton */}
          <div className="w-20 h-20 bg-white/20 rounded-md"></div>
          
          {/* Text content skeleton */}
          <div className="flex flex-col items-start gap-2 flex-1">
            {/* Title skeleton */}
            <div className="h-6 bg-white/20 rounded w-3/4"></div>
            
            {/* Description skeleton - two lines */}
            <div className="h-4 bg-white/20 rounded w-full"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ThemeSkeleton;
