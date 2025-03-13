import styled from 'styled-components';

const StyledCell = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme: { palette } }) => palette.tertiary};
  border-radius: ${({ theme: { borderradius } }) => borderradius};
  opacity: 0.3;
  box-shadow: inset -3px -5px 8px rgba(255, 255, 255, 1),
              inset 3px 5px 8px rgba(0, 0, 0, 0.8);
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

export default StyledCell;
