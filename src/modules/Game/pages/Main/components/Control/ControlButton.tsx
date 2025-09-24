interface ControlButtonProps {
  value: string;
  onClick: () => void;
  disabled: boolean;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  value,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-gray-800/40 hover:bg-gray-400/40 border border-white/20 rounded-full w-6 h-6 flex items-center justify-center cursor-none disabled:opacity-50 disabled:hover:bg-gray-400/20 disabled:bg-gray-400/20"
    >
      {value}
    </button>
  );
};
