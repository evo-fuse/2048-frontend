import styled from 'styled-components';

const StyledCell = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme: { palette } }) => palette.tertiary};
  border-radius: ${({ theme: { borderradius } }) => borderradius};
  opacity: 0.3;
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

export default StyledCell;
