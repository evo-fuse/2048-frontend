import { useCallback, useState } from 'react';

const useGameScore = (initialBest: number, initialCurrent: number) => {
  const safeCurrent = isNaN(initialCurrent) ? 0 : initialCurrent;
  const safeBest = isNaN(initialBest) ? 0 : initialBest;
  const [total, setTotal] = useState(safeCurrent);
  const [best, setBest] = useState(safeBest);

  const addScore = useCallback((s: number) => setTotal((t) => t + s), []);

  if (total > best) {
    setBest(total);
  }

  return {
    total,
    best,
    setTotal,
    addScore,
  };
};

export default useGameScore;
