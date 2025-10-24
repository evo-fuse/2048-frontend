import { FC } from "react";
import StyledTile, { StyledTileProps } from "./StyledTile";
import StyledTileValue from "./StyledTileValue";
import { useGameContext } from "../../context/GameContext";
import { ImageTheme } from "themes/types";

export interface TileProps extends StyledTileProps {
  isNew?: boolean;
  isMerging?: boolean;
}

const Tile: FC<TileProps> = ({
  value,
  x,
  y,
  width,
  height,
  isNew = false,
  isMerging = false,
}) => {
  const { selectedTheme } = useGameContext();
  return (
    <>
      {selectedTheme ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            transition: "transform 0.15s ease-in-out",
            width,
            height,
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <img
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
            style={{
              width: "100%",
              height: "100%",
              fontSize: "inherit",
              display: "flex",
              textAlign: "center",
              flexDirection: "column",
              justifyContent: "center",
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
