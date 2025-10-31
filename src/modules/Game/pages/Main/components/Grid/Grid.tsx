import React, { FC, useMemo } from "react";
import { createIndexArray } from "../../utils/common";
import StyledCell from "./StyledCell";
import { StyledGridProps } from "./StyledGrid";

export type GridProps = StyledGridProps;

const Grid: FC<GridProps> = ({ width, height, rows, cols, spacing }) => {
  const Cells = useMemo(() => {
    const cells = createIndexArray(rows * cols);
    return cells.map((c) => <StyledCell key={c} />);
  }, [rows, cols]);

  return (
    <div
      className="bg-white/5 border-8 border-transparent"
      style={{
        width: width,
        height: height,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridGap: `${spacing}px`,
        display: "grid",
        borderRadius: "14px",
      }}
    >
      {Cells}
    </div>
  );
};

export default React.memo(Grid);
