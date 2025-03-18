import { FC } from 'react';
import StyledTile, { StyledTileProps } from './StyledTile';
import StyledTileValue from './StyledTileValue';

export interface TileProps extends StyledTileProps {
  isnew?: boolean;
  ismerging?: boolean;
  onTransitionEnd?: (event: React.TransitionEvent) => void;
  onAnimationEnd?: (event: React.AnimationEvent) => void;
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
  onAnimationEnd
}) => (
  <StyledTile 
    value={value} 
    x={x} 
    y={y} 
    width={width} 
    height={height}
    onTransitionEnd={onTransitionEnd}
  >
    <StyledTileValue 
      value={value} 
      isnew={isnew} 
      ismerging={ismerging}
      onAnimationEnd={onAnimationEnd}
    >
      {value}
    </StyledTileValue>
  </StyledTile>
);

export default Tile;
