import styled, { css } from 'styled-components';
import { SpacingValues } from '../../themes/constants';
import { Color, Spacing } from '../../themes/types';

export type Length = string | 0;
export type BoxSpacing = Spacing | 0;

/**
 * inline -> width, left, right
 * block -> height, top, bottom
 * start -> left in inline, top in block
 * end -> right in inline, bottom in block
 */
export interface StyledBoxProps {
  position?: 'relative' | 'absolute' | 'fixed' | 'static' | 'sticky';
  boxsizing?: 'border-box' | 'content-box';
  top?: BoxSpacing;
  left?: BoxSpacing;
  right?: BoxSpacing;
  bottom?: BoxSpacing;
  padding?: BoxSpacing;
  margin?: BoxSpacing;
  paddingInline?: BoxSpacing;
  paddingInlineStart?: BoxSpacing;
  paddingInlineEnd?: BoxSpacing;
  paddingblock?: BoxSpacing;
  paddingblockStart?: BoxSpacing;
  paddingblockEnd?: BoxSpacing;
  margininline?: BoxSpacing;
  margininlineStart?: BoxSpacing;
  margininlineend?: BoxSpacing;
  marginblock?: BoxSpacing;
  marginblockstart?: BoxSpacing;
  marginblockend?: BoxSpacing;
  inlinesize?: Length;
  blocksize?: Length;
  mininlinesize?: Length;
  minblocksize?: Length;
  maxinlinesize?: Length;
  maxblocksize?: Length;
  flexdirection?: 'row' | 'column'; // omit other properties
  justifycontent?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-evenly'
    | 'space-around';
  alignitems?: 'center' | 'start' | 'end' | 'stretch';
  background?: Color;
  borderradius?: Length;
}

const getBoxSizeStyles = ({
  position,
  boxsizing,
  top,
  left,
  right,
  bottom,
  inlinesize,
  blocksize,
  minblocksize,
  mininlinesize,
  maxblocksize,
  maxinlinesize,
  padding,
  margin,
  paddingblock,
  paddingInline,
  marginblock,
  margininline,
  marginblockstart = marginblock,
  marginblockend = marginblock,
  margininlineStart = margininline,
  margininlineend = margininline,
  paddingblockStart = paddingblock,
  paddingblockEnd = paddingblock,
  paddingInlineStart = paddingInline,
  paddingInlineEnd = paddingInline,
}: StyledBoxProps) => css`
  position: ${position};
  box-sizing: ${boxsizing};
  top: ${top};
  left: ${left};
  right: ${right};
  bottom: ${bottom};
  width: ${inlinesize};
  height: ${blocksize};
  min-width: ${mininlinesize};
  min-height: ${minblocksize};
  max-width: ${maxinlinesize};
  max-height: ${maxblocksize};
  padding: ${padding && SpacingValues[padding]};
  margin: ${margin && SpacingValues[margin]};
  padding-top: ${paddingblockStart && SpacingValues[paddingblockStart]};
  padding-bottom: ${paddingblockEnd && SpacingValues[paddingblockEnd]};
  padding-left: ${paddingInlineStart && SpacingValues[paddingInlineStart]};
  padding-right: ${paddingInlineEnd && SpacingValues[paddingInlineEnd]};
  margin-top: ${marginblockstart && SpacingValues[marginblockstart]};
  margin-bottom: ${marginblockend && SpacingValues[marginblockend]};
  margin-left: ${margininlineStart && SpacingValues[margininlineStart]};
  margin-right: ${margininlineend && SpacingValues[margininlineend]};
`;

const StyledBox = styled.div<StyledBoxProps>`
  display: flex;
  flex-direction: ${({ flexdirection = 'row' }) => flexdirection};
  align-items: center;
  justify-content: ${({ justifycontent }) => {
    if (justifycontent === 'start' || justifycontent === 'end') {
      return `flex-${justifycontent}`;
    }
    return justifycontent;
  }};
  align-items: ${({ alignitems }) => alignitems};
  background-color: ${({ theme: { palette }, background = 'background' }) =>
    palette[background]};
  border-radius: ${({ theme, borderradius }) =>
    borderradius ?? theme.borderradius};
  color: ${({ theme: { palette } }) => palette.foreground};
  ${getBoxSizeStyles}
`;

export default StyledBox;
