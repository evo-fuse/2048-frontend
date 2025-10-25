import { FC, useCallback, useMemo } from "react";
import StyledTile, { StyledTileProps } from "./StyledTile";
import StyledTileValue from "./StyledTileValue";
import { Item, useGameContext } from "../../context/GameContext";
import { ImageTheme } from "themes/types";
import { Location } from "hooks/useGameBoard";

export interface TileProps extends StyledTileProps {
  isNew?: boolean;
  isMerging?: boolean;
  breakTile: (position: Location) => void;
  upgradeTile: (position: Location) => void;
  handleSwapTile: (swapTile: Location, position: Location) => void;
}

const Tile: FC<TileProps> = ({
  value,
  x,
  y,
  width,
  height,
  isNew = false,
  isMerging = false,
  breakTile,
  upgradeTile,
  handleSwapTile,
}) => {
  const { selectedTheme, item, setItem, swapTile, setSwapTile } = useGameContext();
  const position = useMemo(() => {
    return {
      r: Math.floor((y - 8) / height),
      c: Math.floor((x - 8) / width),
    };
  }, [x, y, width, height]);
  const handleClickTile = useCallback(() => {
    if (item === Item.NONE) return;
    if (item === Item.BREAK) {
      breakTile(position);
      setItem(Item.NONE);
    } else if (item === Item.UPGRADE) {
      upgradeTile(position);
      setItem(Item.NONE);
    } else if (item === Item.SWAP) {
      if (swapTile === null) {
        setSwapTile(position);
      } else {
        handleSwapTile(swapTile, position);
        setSwapTile(null);
        setItem(Item.NONE);
      }
    }
  }, [item, position, breakTile, upgradeTile, swapTile]);
  return (
    <>
      {selectedTheme ? (
        <div
          className="absolute top-0 left-0 flex justify-center"
          style={{
            transition: "transform 0.15s ease-in-out",
            width,
            height,
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <img
            onClick={handleClickTile}
            src={
              selectedTheme[
                value as keyof Omit<
                  ImageTheme,
                  | "uuid"
                  | "title"
                  | "description"
                  | "visibility"
                  | "price"
                  | "numberDisplay"
                  | "position"
                  | "numberColor"
                  | "numberSize"
                  | "owned"
                  | "creator_id"
                >
              ]?.sm
            }
            className="w-full h-full font-inherit flex text-center flex-col justify-center transition-all duration-100"
            style={{
              animationName: isMerging ? "pop" : isNew ? "expand" : "",
              animationDuration: "0.18s",
              animationFillMode: "forwards",
            }}
            alt="tile"
          />
        </div>
      ) : (
        <StyledTile value={value} x={x} y={y} width={width} height={height}>
          <StyledTileValue value={value} isNew={isNew} isMerging={isMerging}>
            {value}
          </StyledTileValue>
        </StyledTile>
      )}
    </>
  );
};

export default Tile;
