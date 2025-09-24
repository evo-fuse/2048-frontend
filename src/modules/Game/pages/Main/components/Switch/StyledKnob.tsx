import styled, { css } from 'styled-components';
import { Color } from '../../themes/types';

export interface StyledKnobProps {
  active: boolean;
  knobcolor: Color;
  activecolor: Color;
  inactivecolor: Color;
}

const getKnobBackground = ({
  active,
  activecolor,
  inactivecolor,
}: StyledKnobProps) => css`
  background-color: ${({ theme: { palette } }) =>
    palette[active ? activecolor : inactivecolor]};
`;

const StyledKnob = styled.span<StyledKnobProps>`
  position: relative;
  box-sizing: border-box;
  display: block;
  width: 40px;
  height: 20px;
  cursor: none;
  transition: background-color 0.2s ease-in;
  ${getKnobBackground};

  ::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    border-radius: 100%;
    width: 16px;
    height: 16px;
    transition: all 0.2s ease-in;
    background-color: ${({ theme: { palette }, knobcolor }) =>
      palette[knobcolor]};
    transform: ${({ active }) => active && 'translateX(20px)'};
  }
`;

export default StyledKnob;
