import { useCallback, useEffect, useRef, useState } from "react";
import {
  nextTileIndex,
  getId,
  resetTileIndex,
  shuffle,
  create2DArray,
} from "../utils/common";
import type { GameState } from "./useGameState";
import useLazyRef from "./useLazyRef";
import { useGameContext } from "../../../context";
import { Activity } from "../../../../../context";

export interface Location {
  r: number;
  c: number;
}

export interface Tile extends Location {
  index: number; // self increment index
  id: string;
  isnew: boolean;
  ismerging: boolean;
  canMerge: boolean;
  value: number;
}

export type Cell = Tile | undefined;

export type GameBoardParamsForReplay = {
  rows: number;
  cols: number;
  gameState: GameState;
  addScore: (score: number) => void;
  replay: Activity[];
  index: number;
};

const createNewTile = (r: number, c: number): Tile => {
  const index = nextTileIndex();
  const id = getId(index);
  return {
    index,
    id,
    r,
    c,
    isnew: true,
    canMerge: false,
    ismerging: false,
    value: Math.random() > 0.99 ? 4 : 2,
  };
};

const getEmptyCellsLocation = (grid: Cell[][]) =>
  grid.flatMap((row, r) =>
    row.flatMap<Location>((cell, c) => (cell == null ? { r, c } : []))
  );

const createNewTilesInEmptyCells = (
  emptyCells: Location[],
  tilesNumber: number
) => {
  const actualTilesNumber =
    emptyCells.length < tilesNumber ? emptyCells.length : tilesNumber;

  if (!actualTilesNumber) return [];

  return shuffle(emptyCells)
    .slice(0, actualTilesNumber)
    .map(({ r, c }) => createNewTile(r, c));
};

const sortTiles = (tiles: Tile[]) =>
  [...tiles].sort((t1, t2) => t1.index - t2.index);

const mergeAndCreateNewTiles = (grid: Cell[][]) => {
  const tiles: Tile[] = [];
  let score = 0;

  const newGrid = grid.map((row) =>
    row.map((tile) => {
      if (tile != null) {
        const { canMerge, value, index, ...rest } = tile;
        const newValue = canMerge ? 2 * value : value;
        const mergedTile = {
          ...rest,
          index,
          value: newValue,
          ismerging: canMerge,
          canMerge: false,
          isnew: false,
        };

        tiles.push(mergedTile);

        if (canMerge) {
          score += newValue;
        }

        return mergedTile;
      }

      return tile;
    })
  );

  return {
    grid: newGrid,
    tiles,
    score,
  };
};

const createInitialTiles = (grid: Cell[][]) => {
  const emptyCells = getEmptyCellsLocation(grid);
  const rows = grid.length;
  const cols = grid[0].length;
  return createNewTilesInEmptyCells(emptyCells, Math.ceil((rows * cols) / 8));
};

const resetGameBoard = (rows: number, cols: number) => {
  // Index restarts from 0 on reset
  resetTileIndex();
  const grid = create2DArray<Cell>(rows, cols);
  const newTiles = createInitialTiles(grid);

  newTiles.forEach((tile) => {
    grid[tile.r][tile.c] = tile;
  });

  return {
    grid,
    tiles: newTiles,
  };
};

const useGameBoardForReplay = ({
  rows,
  cols,
  gameState,
  addScore,
  replay,
  index
}: GameBoardParamsForReplay) => {
  const { powerup } = useGameContext();
  const gridMapRef = useLazyRef(() => {
    const grid = create2DArray<Cell>(rows, cols);
    const tiles = replay.length > 0 ? [...replay[0].tiles] : createInitialTiles(grid);
    tiles.forEach((tile) => {
      grid[tile.r][tile.c] = tile;
    });

    return { grid, tiles };
  });

  const [tiles, setTiles] = useState<Tile[]>(gridMapRef.current.tiles);
  const pendingStackRef = useRef<number[]>([]);
  const pauseRef = useRef(gameState.pause);

  useEffect(() => {
    if (replay.length > 0) {
      const grid = create2DArray<Cell>(rows, cols);
      const newTiles = replay[index] ? [...replay[index].tiles] : createInitialTiles(grid);
      newTiles.forEach((tile) => {
        grid[tile.r][tile.c] = tile;
      });
      
      gridMapRef.current = { grid, tiles: newTiles as Tile[] };
      setTiles(sortTiles(newTiles));
    }
  }, [replay, rows, cols, index]);

  const breakTile = useCallback(
    (tile: Location) => {
      if (pendingStackRef.current.length > 0 || pauseRef.current) {
        return;
      }

      const { r, c } = tile;
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
      }

      const targetTile = gridMapRef.current.grid[r][c];
      if (!targetTile) {
        return;
      }

      const newGrid = gridMapRef.current.grid.map((row) => [...row]);
      newGrid[r][c] = undefined;

      const updatedTiles = gridMapRef.current.tiles.filter(
        (t) => t.r !== r || t.c !== c
      );
      gridMapRef.current = { grid: newGrid, tiles: updatedTiles };
      setTiles(sortTiles(updatedTiles));
      addScore((targetTile.value * 2 - 2) * -1);
    },
    [gridMapRef, addScore, rows, cols]
  );

  const doubleTile = useCallback(
    (tile: Location) => {
      if (pendingStackRef.current.length > 0 || pauseRef.current) {
        return;
      }
      const { r, c } = tile;
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
      }

      const targetTile = gridMapRef.current.grid[r][c];
      if (!targetTile) {
        return;
      }

      const newGrid = gridMapRef.current.grid.map((row) => [...row]);
      newGrid[r][c] = {
        ...targetTile,
        value: targetTile.value * 2,
        isnew: true,
        canMerge: false,
        ismerging: false,
      };

      const updatedTiles = gridMapRef.current.tiles.map((t) =>
        t.r === r && t.c === c ? { ...t, value: targetTile.value * 2 } : t
      );
      gridMapRef.current = { grid: newGrid, tiles: updatedTiles };
      setTiles(sortTiles(updatedTiles));
    },
    [gridMapRef, rows, cols]
  );

  const onMovePending = useCallback(() => {
    pendingStackRef.current.pop();
    if (pendingStackRef.current.length === 0) {
      const {
        tiles: newTiles,
        score,
        grid,
      } = mergeAndCreateNewTiles(gridMapRef.current.grid);
      console.log("newTiles", newTiles);
      gridMapRef.current = { grid, tiles: newTiles };
      addScore(powerup > 0 ? score * 2 : score);
      pendingStackRef.current = newTiles
        .filter((tile) => tile.ismerging || tile.isnew)
        .map((tile) => tile.index);
      setTiles(sortTiles(newTiles));
    }
  }, [addScore, gridMapRef, powerup]);

  const onMergePending = useCallback(() => {
    pendingStackRef.current.pop();
  }, []);

  if (pauseRef.current !== gameState.pause) {
    pauseRef.current = gameState.pause;
  }

  if (gameState.status === "restart") {
    const { grid, tiles: newTiles } = resetGameBoard(rows, cols);
    gridMapRef.current = { grid, tiles: newTiles };
    pendingStackRef.current = [];
    setTiles(newTiles);
  }

  return {
    tiles,
    grid: gridMapRef.current.grid,
    onMovePending,
    onMergePending,
    breakTile,
    doubleTile,
  };
};

export default useGameBoardForReplay;
