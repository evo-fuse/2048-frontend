interface RibbonProps {
  color?: string;
  title?: string;
  top?: number;
  left?: number;
}

export const Ribbon: React.FC<RibbonProps> = ({
  color = "red",
  title = "Selected",
  top = -8,
  left = -8,
}) => {
  const bgColor: Record<string, string[]> = {
    red: ["bg-red-500", "bg-red-800"],
    blue: ["bg-blue-500", "bg-blue-800"],
    green: ["bg-green-500", "bg-green-800"],
    yellow: ["bg-yellow-500", "bg-yellow-800"],
    purple: ["bg-purple-500", "bg-purple-800"],
    cyan: ["bg-cyan-500", "bg-cyan-800"],
    pink: ["bg-pink-500", "bg-pink-800"],
  };
  return (
    <div
      className="w-16 h-16 absolute flex flex-col items-center justify-center overflow-hidden"
      style={{ top, left }}
    >
      <div
        className={`relative z-20 w-32 h-5 -rotate-45 top-[-7px] left-[-7px] ${bgColor[color][0]} text-white text-xs text-center flex items-center justify-center`}
      >
        {title}
      </div>
      <div
        className={`z-10 absolute top-0 right-0 min-w-[8px] min-h-[8px] ${bgColor[color][1]}`}
      ></div>
      <div
        className={`z-10 absolute bottom-0 left-0 min-w-[8px] min-h-[8px] ${bgColor[color][1]}`}
      ></div>
    </div>
  );
};
