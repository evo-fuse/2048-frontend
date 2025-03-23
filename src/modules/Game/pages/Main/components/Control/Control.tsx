import React, { FC } from "react";
import { MAX_SCALE, MIN_SCALE } from "../../utils/constants";
import Box from "../Box";
import Text from "../Text";
import { useAuthContext } from "../../../../../../context";
import { ControlButton } from "./ControlButton";

export interface ControlProps {
  rows: number;
  cols: number;
  onReset: () => void;
  onChangeRow: (newRow: number) => void;
  onChangeCol: (newCol: number) => void;
}

const Control: FC<ControlProps> = ({
  rows,
  cols,
  onReset,
  onChangeRow,
  onChangeCol,
}) => {
  const { user } = useAuthContext();
  return (
    <Box inlinesize="100%" justifycontent="space-between">
      <button
        className="bg-gray-800/40 hover:bg-gray-300/20 transition border border-white/10 rounded-lg p-2"
        onClick={onReset}
      >
        <Text fontSize={16} texttransform="capitalize">
          new game
        </Text>
      </button>
      <Box>
        <Box margininlineend="s6" flexdirection="column">
          <Text texttransform="uppercase" fontSize={13} color="white">
            rows
          </Text>
          <Box padding="s2">
            <ControlButton
              value="-"
              onClick={() => onChangeRow(-1)}
              disabled={rows === MIN_SCALE}
            />
            <Box margininline="s3">
              <Text fontSize={16} color="white">
                {rows}
              </Text>
            </Box>
            <ControlButton
              value="+"
              onClick={() => onChangeRow(1)}
              disabled={rows === MAX_SCALE || rows === user?.rows}
            />
          </Box>
        </Box>
        <Box flexdirection="column">
          <Text texttransform="uppercase" fontSize={13} color="white">
            cols
          </Text>
          <Box padding="s2">
            <ControlButton
              value="-"
              onClick={() => onChangeCol(-1)}
              disabled={cols === MIN_SCALE}
            />
            <Box margininline="s3">
              <Text fontSize={16} color="white">
                {cols}
              </Text>
            </Box>
            <ControlButton
              value="+"
              onClick={() => onChangeCol(1)}
              disabled={cols === MAX_SCALE || cols === user?.cols}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(Control);
