import React, { FC, RefObject, useEffect, useRef, useState } from "react";
import useArrowKeyPress from "../../hooks/useArrowKeyPress";
import type { Location, Tile } from "../../hooks/useGameBoard";
import useSwipe from "../../hooks/useSwipe";
import { calcLocation, calcTileSize } from "../../utils/common";
import { Vector } from "../../utils/types";
import Grid from "../Grid";
import TileComponent from "../Tile";
import Fireworks from "../../../../../../assets/video/fireworks.mp4";
import { useGameContext } from "../../../../context/GameContext";

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
  showFireworks?: boolean;
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
  showFireworks = false,
}) => {
  const { setFireworksState, fireworksState } = useGameContext();
  const [fireworksVisible, setFireworksVisible] = useState(false);
  const [{ width: tileWidth, height: tileHeight }, setTileSize] = useState(() =>
    calcTileSize(boardSize, rows, cols, spacing)
  );
  const boardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useArrowKeyPress(onMove);
  useSwipe(boardRef as RefObject<HTMLElement>, onMove);

  useEffect(() => {
    setTileSize(calcTileSize(boardSize, rows, cols, spacing));
  }, [boardSize, cols, rows, spacing]);

  useEffect(() => {
    console.log("fireworksState", fireworksState);
    console.log("showFireworks", showFireworks);
    console.log("fireworksVisible", fireworksVisible);
    console.log("");
    if (showFireworks && !fireworksState) {
      setFireworksState(true);
      setFireworksVisible(true);
      if (videoRef.current) {
        console.log("videoRef.current", videoRef.current);
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        videoRef.current.playbackRate = 1.75;
      }

      console.log("start timer");
      setTimeout(() => {
        console.log("stop timer");
        setFireworksVisible(false);
      }, 4500);
    }
  }, [showFireworks, fireworksState, setFireworksState]);

  return (
    <div className="relative" ref={boardRef}>
      <div className="absolute inset-0 z-10 pointer-events-none rounded-md">
        <video
          ref={videoRef}
          loop
          muted
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-500 ${
            fireworksVisible ? "opacity-50" : "opacity-0"
          }`}
          src={Fireworks}
        >
          Your browser does not support the video tag.
        </video>
      </div>
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
