import styled from 'styled-components';
import { pop, expand } from '../../utils/animation';
import { getTileColor } from '../../utils/common';
export interface StyledTileValueProps {
  isnew: boolean;
  ismerging: boolean;
  value: number;
}

const StyledTileValue = styled.div<StyledTileValueProps>`
  width: 100%;
  height: 100%;
  font-size: inherit;
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({ theme: { palette }, value }) =>
    palette[getTileColor(value)]};
  animation-name: ${({ ismerging, isnew }) =>
    ismerging ? pop : isnew ? expand : ''};
  animation-duration: 0.05s;
  animation-fill-mode: forwards;
  color: ${({ theme: { palette }, value }) =>
    value > 4 ? palette.foreground : palette.primary};
  user-select: none;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    z-index: -1;
  }
`;

export default StyledTileValue;
