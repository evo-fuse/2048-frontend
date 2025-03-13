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
  border-radius: ${({ theme }) => theme.borderradius};
  background-color: ${({ theme: { palette }, value }) =>
    palette[getTileColor(value)]};
  animation-name: ${({ ismerging, isnew }) =>
    ismerging ? pop : isnew ? expand : ''};
  animation-duration: 0.18s;
  animation-fill-mode: forwards;
  color: ${({ theme: { palette }, value }) =>
    value > 4 ? palette.foreground : palette.primary};
  user-select: none;
  box-shadow: inset 5px 5px 8px rgba(255, 255, 255, 1),
              inset -5px -5px 8px rgba(0, 0, 0, 0.8);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
`;

export default StyledTileValue;
