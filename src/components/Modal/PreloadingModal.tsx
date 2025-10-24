import React from 'react';
import { ImageTheme } from '../../themes/types';

interface PreloadingModalProps {
  isOpen: boolean;
  theme: ImageTheme | null;
}

const PreloadingModal: React.FC<PreloadingModalProps> = ({ isOpen, theme }) => {
  if (!isOpen || !theme) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">
      <div className="bg-tile2 p-6 rounded-xl shadow-2xl max-w-md w-full border-2 bg-white/10 border-white/40 transform transition-all">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-xl font-bold text-white">Preloading Theme</h3>
          
          {/* Theme preview */}
          <div className="flex items-center gap-4">
            <img
              src={theme[2].sm}
              alt={theme.title}
              className="w-20 h-20 rounded-md shadow-md object-cover"
            />
            <div>
              <p className="font-bold text-white text-lg">{theme.title}</p>
              <p className="text-sm text-white/80">Preparing theme assets...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreloadingModal;
