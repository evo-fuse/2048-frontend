interface ControlButtonProps {
  value: string;
  onClick: () => void;
  disabled: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  value,
  onClick,
  disabled,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        group relative
        bg-gradient-to-br from-cyan-600/50 to-cyan-700/50
        hover:from-cyan-500/70 hover:to-cyan-600/70
        active:from-cyan-400/80 active:to-cyan-500/80
        transition-all duration-200
        border border-cyan-400/60 hover:border-cyan-300/80
        rounded-lg
        w-7 h-7
        flex items-center justify-center
        text-white font-bold text-xs
        shadow-md hover:shadow-lg hover:shadow-cyan-500/30
        backdrop-blur-sm
        disabled:opacity-40 
        disabled:hover:from-cyan-600/50 disabled:hover:to-cyan-700/50
        disabled:hover:border-cyan-400/60
        disabled:cursor-none
        disabled:shadow-none
        cursor-none
      `}
    >
      <span className="relative z-10">{value}</span>
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </button>
  );
};
