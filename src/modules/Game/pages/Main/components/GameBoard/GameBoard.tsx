import React, { FC, RefObject, useEffect, useRef, useState } from "react";
import useArrowKeyPress from "../../hooks/useArrowKeyPress";
import type { Location, Tile } from "../../hooks/useGameBoard";
import useSwipe from "../../hooks/useSwipe";
import { calcLocation, calcTileSize } from "../../utils/common";
import { Vector } from "../../utils/types";
import Grid from "../Grid";
import TileComponent from "../Tile";

export interface GameBoardProps {
  tiles?: Tile[];
  rows: number;
  cols: number;
  boardSize: number;
  spacing: number;
  onMove: (dir: Vector) => void;
  onMovePending: () => void;
  onMergePending: () => void;
  breakTile: (tile: Location) => void;
  doubleTile: (tile: Location) => void;
}

const GameBoard: FC<GameBoardProps> = ({
  tiles,
  rows,
  cols,
  boardSize,
  spacing,
  onMove,
  onMovePending,
  onMergePending,
  breakTile,
  doubleTile,
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
    <div className="relative" ref={boardRef}>
      <Grid
        width={boardSize}
        height={boardSize}
        rows={rows}
        cols={cols}
        spacing={spacing}
      />
      <div
        className="absolute top-0 left-0 bg-transparent w-full h-full"
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
            breakTile={breakTile}
            doubleTile={doubleTile}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(GameBoard);
