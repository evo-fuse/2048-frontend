import React, { FC, RefObject, useEffect, useRef, useState } from "react";
import useArrowKeyPress from "../../hooks/useArrowKeyPress";
import type { Tile } from "../../hooks/useGameBoard";
import type { GameStatus } from "../../hooks/useGameState";
import useSwipe from "../../hooks/useSwipe";
import { calcLocation, calcTileSize } from "../../utils/common";
import { Vector } from "../../utils/types";
import Box from "../Box";
import Grid from "../Grid";
import Notification from "../Notification";
import TileComponent from "../Tile";

export interface GameBoardProps {
  tiles?: Tile[];
  gameStatus: GameStatus;
  rows: number;
  cols: number;
  boardSize: number;
  spacing: number;
  onMove: (dir: Vector) => void;
  onMovePending: () => void;
  onMergePending: () => void;
  onCloseNotification: (currentStatus: GameStatus) => void;
}

const GameBoard: FC<GameBoardProps> = ({
  tiles,
  gameStatus,
  rows,
  cols,
  boardSize,
  spacing,
  onMove,
  onMovePending,
  onMergePending,
  onCloseNotification,
}) => {
  const [{ width: tileWidth, height: tileHeight }, setTileSize] = useState(() =>
    calcTileSize(boardSize, rows, cols, spacing)
  );
  const boardRef = useRef<HTMLDivElement>(null);
  useArrowKeyPress(onMove);
  useSwipe(boardRef as RefObject<HTMLElement>, onMove);

  useEffect(() => {
    setTileSize(calcTileSize(boardSize, rows, cols, spacing));
  }, [boardSize, cols, rows, spacing]);

  return (
    <Box position="relative" ref={boardRef}>
      <Grid
        width={boardSize}
        height={boardSize}
        rows={rows}
        cols={cols}
        spacing={spacing}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        background="transparent"
        blocksize="100%"
        inlinesize="100%"
        onTransitionEnd={onMovePending}
        onAnimationEnd={onMergePending}
      >
        {tiles?.map(({ r, c, id, value, ismerging, isnew }) => (
          <TileComponent
            key={id}
            width={tileWidth}
            height={tileHeight}
            x={calcLocation(tileWidth, c, spacing)}
            y={calcLocation(tileHeight, r, spacing)}
            value={value}
            isnew={isnew}
            ismerging={ismerging}
          />
        ))}
      </Box>
      {(gameStatus === "win" || gameStatus === "lost") && (
        <Notification
          win={gameStatus === "win"}
          onClose={() => onCloseNotification(gameStatus)}
        />
      )}
    </Box>
  );
};

export default React.memo(GameBoard);
