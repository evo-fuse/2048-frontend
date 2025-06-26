import { FC, useCallback, useMemo, useState } from "react";
import StyledTile, { StyledTileProps } from "./StyledTile";
import StyledTileValue from "./StyledTileValue";
import { Location } from "../../hooks/useGameBoard";
import { useAuthContext } from "../../../../../../context";
import { Images } from "../../../../../../assets/images";
import { useGameContext } from "../../../../context";

export interface TileProps extends StyledTileProps {
  isnew?: boolean;
  ismerging?: boolean;
  onTransitionEnd?: (event: React.TransitionEvent) => void;
  onAnimationEnd?: (event: React.AnimationEvent) => void;
  breakTile?: (tile: Location) => void;
  doubleTile?: (tile: Location) => void;
}

const Tile: FC<TileProps> = ({
  value,
  x,
  y,
  width,
  height,
  isnew = false,
  ismerging = false,
  onTransitionEnd,
  onAnimationEnd,
  breakTile,
  doubleTile,
}) => {
  const { cursor, setCursor, handleUpdateItem, user, setUser } =
    useAuthContext();
  const { selectedTheme, itemUsage, setItemUsage } = useGameContext();
  const [isHover, setIsHover] = useState(false);

  // Calculate position once
  const position = useMemo(() => {
    return {
      r: Math.floor((y - 8) / height),
      c: Math.floor((x - 8) / width),
    };
  }, [x, y, width, height]);

  const isHammerActive = isHover && cursor === Images.HAMMER;
  const isUpgradeActive = isHover && cursor === Images.UPGRADE;

  const tileValue = useMemo(
    () => (isUpgradeActive ? value * 2 : value),
    [isUpgradeActive, value]
  );

  const handleClick = useCallback(() => {
    if (breakTile && cursor === Images.HAMMER && user) {
      breakTile(position);
      setCursor(Images.Cursor);
      handleUpdateItem("hammer", -1);
      setUser({ ...user, hammer: user.hammer - 1 });
    } else if (doubleTile && cursor === Images.UPGRADE && user) {
      doubleTile(position);
      setCursor(Images.Cursor);
      handleUpdateItem("upgrade", -1);
      setUser({ ...user, upgrade: user.upgrade - 1 });
      setItemUsage({ ...itemUsage, upgrade: true });
    }
  }, [breakTile, doubleTile, cursor, position, setCursor, handleUpdateItem]);

  const handleMouseEnter = useCallback(() => setIsHover(true), []);
  const handleMouseLeave = useCallback(() => setIsHover(false), []);

  const renderTileContent = (width: number, height: number) => {
    if (selectedTheme === "Basic" || tileValue > 8192) {
      return (
        <StyledTileValue
          value={tileValue}
          isnew={isnew}
          ismerging={ismerging}
          onAnimationEnd={onAnimationEnd}
          transparent={false}
        >
          {tileValue}
        </StyledTileValue>
      );
    }

    return (
      <StyledTileValue
        transparent
        value={tileValue}
        isnew={isnew}
        ismerging={ismerging}
        onAnimationEnd={onAnimationEnd}
      >
        {selectedTheme.numberDisplay && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <p
              style={{
                color: selectedTheme.numberColor,
                fontSize: selectedTheme.numberSize / 2,
              }}
            >
              {tileValue}
            </p>
          </div>
        )}
        <img
          src={
            selectedTheme[
              tileValue as
                | 2
                | 4
                | 8
                | 16
                | 32
                | 64
                | 128
                | 256
                | 512
                | 1024
                | 2048
                | 4096
                | 8192
            ].sm
          }
          style={{ width, height }}
          alt={tileValue.toString()}
        />
      </StyledTileValue>
    );
  };

  return (
    <StyledTile
      value={tileValue}
      x={x}
      y={y}
      width={width}
      height={height}
      onTransitionEnd={onTransitionEnd}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHammerActive && (
        <div
          className="absolute bg-black/10 z-20"
          style={{ width, height }}
        ></div>
      )}
      {isUpgradeActive && (
        <div
          className="absolute bg-black/50 z-20 animate-pulse"
          style={{ width, height }}
        ></div>
      )}
      {renderTileContent(width, height)}
    </StyledTile>
  );
};

export default Tile;
