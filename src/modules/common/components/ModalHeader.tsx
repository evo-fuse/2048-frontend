import React from "react";

interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="bg-gradient-to-b from-[#042035]/95 via-[#020f1c]/95 to-[#01070d]/95 sticky w-full z-30 top-0 rounded-t-2xl">
      <div className="flex justify-between items-center px-6 py-10 bg-gradient-to-b from-cyan-900/40 to-transparent rounded-t-2xl border-b border-cyan-400/20">
        <h2 className="text-2xl font-bold text-cyan-50">{title}</h2>
        {onClose && <button
          onClick={onClose}
          className="text-cyan-300/70 hover:text-cyan-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>}
      </div>
    </div>
  );
}; 