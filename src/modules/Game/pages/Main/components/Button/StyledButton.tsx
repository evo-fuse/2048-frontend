import styled, { css } from "styled-components";

export interface StyledButtonProps {
  disable?: boolean;
  mini?: boolean;
}

const getMiniProps = () => css`
  width: 24px;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  padding: 0;
`;

const StyledButton = styled.button<StyledButtonProps>`
  outline: none;
  border: none;
  padding: 8px 16px;
  line-height: 1.75;
  margin: 0;
  white-space: nowrap;
  ${({ mini }) => mini && getMiniProps};
  border-radius: ${({ theme }) => theme.borderradius};
  background: ${({ theme: { palette } }) => palette.primary};
  color: ${({ theme: { palette } }) => palette.foreground};
  opacity: ${({ disable }) => disable && 0.7};
  cursor: none;
  ${({ disable }) =>
    !disable &&
    css`
      &:hover {
        background: ${({ theme: { palette } }) => palette.primary};
        transform: scale(1.05);
      }
    `}
  transition: all 0.3s ease;
`;

export default StyledButton;
