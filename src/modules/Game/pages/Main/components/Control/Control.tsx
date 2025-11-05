import React, { FC } from "react";
import { MAX_SCALE, MIN_SCALE } from "../../utils/constants";
import Box from "../Box";
import Text from "../Text";
import { useAuthContext, useRecordContext } from "../../../../../../context";
import { ControlButton } from "./ControlButton";
import { IoStop, IoPlay } from "react-icons/io5";
import { Tile } from "../../hooks/useGameBoard";
import { IoRefreshOutline } from "react-icons/io5";

export interface ControlProps {
  rows: number;
  cols: number;
  onReset: () => void;
  onChangeGrid: (newRow: number) => void;
  tiles: Tile[];
}

const Control: FC<ControlProps> = ({
  rows,
  cols,
  onReset,
  onChangeGrid,
  tiles,
}) => {
  const { user } = useAuthContext();
  const { recording, setRecording, onRecordOpen, activity, setActivity } =
    useRecordContext();
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
    <Box inlinesize="100%" justifycontent="space-between">
      <div className="flex items-center gap-2">
        <button
          className="bg-gray-800/40 hover:bg-gray-300/20 transition border border-white/10 rounded-lg p-2 flex items-center gap-2"
          onClick={onReset}
        >
          <IoRefreshOutline />
          <Text fontSize={16} texttransform="capitalize">
            new game
          </Text>
        </button>
        <button
          className="bg-gray-800/40 hover:bg-gray-300/20 transition border border-white/10 rounded-lg p-2"
          onClick={handleRecordClick}
        >
          {recording ? (
            <label className="text-red-500 flex items-center gap-2">
              <IoStop />
              Recording...
            </label>
          ) : (
            <label className="text-green-500 flex items-center gap-2">
              <IoPlay />
              Record
            </label>
          )}
        </button>
      </div>
      <Box>
        <Box margininlineend="s6" flexdirection="column">
          <Text texttransform="uppercase" fontSize={13} color="white">
            Grid
          </Text>
          <Box padding="s2">
            <ControlButton
              value="-"
              onClick={() => { onChangeGrid(-1); }}
              disabled={cols === MIN_SCALE}
            />
            <Box margininline="s3">
              <Text fontSize={16} color="white">
                {cols}
              </Text>
            </Box>
            <ControlButton
              value="+"
              onClick={() => { onChangeGrid(1); }}
              disabled={cols === MAX_SCALE || cols === user?.cols}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Control);
