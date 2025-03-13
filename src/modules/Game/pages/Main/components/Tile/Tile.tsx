import React, { FC } from 'react';
import StyledTile, { StyledTileProps } from './StyledTile';
import StyledTileValue from './StyledTileValue';

export interface TileProps extends StyledTileProps {
  isnew?: boolean;
  ismerging?: boolean;
}

const Tile: FC<TileProps> = ({
  value,
  x,
  y,
  width,
  height,
  isnew = false,
  ismerging = false,
}) => (
  <StyledTile value={value} x={x} y={y} width={width} height={height}>
    <StyledTileValue value={value} isnew={isnew} ismerging={ismerging}>
      {value}
    </StyledTileValue>
  </StyledTile>
);

export default Tile;
