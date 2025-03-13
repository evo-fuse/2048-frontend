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
`;

export default StyledTileValue;
