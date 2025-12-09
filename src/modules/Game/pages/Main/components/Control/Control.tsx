import React, { FC, useState } from "react";
import { MAX_SCALE, MIN_SCALE } from "../../utils/constants";
import Text from "../Text";
import { useAuthContext, useRecordContext } from "../../../../../../context";
import { ControlButton } from "./ControlButton";
import { IoStop, IoPlay } from "react-icons/io5";
import { Tile } from "../../hooks/useGameBoard";
import { FaRedo } from "react-icons/fa";

export interface ControlProps {
  rows: number;
  cols: number;
  onReset: () => void;
  onChangeGrid: (newRow: number) => void;
  tiles: Tile[];
}

const Control: FC<ControlProps> = ({
  cols,
  onReset,
  onChangeGrid,
  tiles,
}) => {
  const { user } = useAuthContext();
  const { recording, setRecording, onRecordOpen, activity, setActivity } =
    useRecordContext();
  const [hoverTitle, setHoverTitle] = useState<string>("Control");

  const handleRecordClick = () => {
    setRecording(!recording);
    if (recording) {
      onRecordOpen();
      setActivity([
        ...activity,
        {
          tiles,
          timestamp: Date.now(),
          vector: { r: 1, c: 1 },
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-1 backdrop-blur-sm rounded-lg p-2 box-border items-center justify-center">
      {/* Title */}
      <div className="text-center">
        <Text
          fontSize={12}
          fontWeight="bold"
          texttransform="uppercase"
          color="white"
          style={{
            textShadow: '0 0 8px rgba(34, 211, 238, 0.5)',
            transition: 'all 0.2s ease',
          }}
        >
          {hoverTitle}
        </Text>
      </div>

      {/* Buttons Container */}
      <div className="flex flex-row items-center justify-center gap-1.5">
        {/* New Game Button */}
        <button
          className={`
            group relative
            bg-gradient-to-br from-cyan-600/50 to-cyan-700/50
            hover:from-cyan-500/70 hover:to-cyan-600/70
            active:from-cyan-400/80 active:to-cyan-500/80
            transition-all duration-200
            border border-cyan-400/60 hover:border-cyan-300/80
            rounded-lg
            flex items-center justify-center
            p-1.5
            w-7 h-7
            shadow-md hover:shadow-lg hover:shadow-cyan-500/20
            backdrop-blur-sm
          `}
          onClick={onReset}
          onMouseEnter={() => setHoverTitle("New Game")}
          onMouseLeave={() => setHoverTitle("Control")}
        >
          <FaRedo className="text-white text-sm transition-transform duration-200 group-hover:rotate-180" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>

        {/* Record Button */}
        <button
          className={`
            group relative
            bg-gradient-to-br from-cyan-600/50 to-cyan-700/50
            hover:from-cyan-500/70 hover:to-cyan-600/70
            active:from-cyan-400/80 active:to-cyan-500/80
            transition-all duration-200
            border border-cyan-400/60 hover:border-cyan-300/80
            rounded-lg
            flex items-center justify-center
            p-1.5
            w-7 h-7
            shadow-md hover:shadow-lg hover:shadow-cyan-500/20
            backdrop-blur-sm
          `}
          onClick={handleRecordClick}
          onMouseEnter={() => setHoverTitle(recording ? "Stop Recording" : "Start Recording")}
          onMouseLeave={() => setHoverTitle("Control")}
        >
          {recording ? (
            <IoStop className="text-red-400 text-sm" />
          ) : (
            <IoPlay className="text-green-400 text-sm" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>

        {/* Minus Button */}
        <ControlButton
          value="-"
          onClick={() => onChangeGrid(-1)}
          disabled={cols === MIN_SCALE}
          onMouseEnter={() => setHoverTitle("Shrink board")}
          onMouseLeave={() => setHoverTitle("Control")}
        />

        {/* Board Size Display */}
        <div className="min-w-[20px] text-center">
          <Text
            fontSize={18}
            fontWeight="bold"
            color="white"
            style={{
              textShadow: '0 0 6px rgba(34, 211, 238, 0.5)',
            }}
          >
            {cols}
          </Text>
        </div>

        {/* Plus Button */}
        <ControlButton
          value="+"
          onClick={() => onChangeGrid(1)}
          disabled={cols === MAX_SCALE || cols === user?.cols || !user}
          onMouseEnter={() => setHoverTitle("Expand board")}
          onMouseLeave={() => setHoverTitle("Control")}
        />
      </div>
    </div>
  );
};

export default React.memo(Control);
