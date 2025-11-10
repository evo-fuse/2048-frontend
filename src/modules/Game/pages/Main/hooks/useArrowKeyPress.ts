import { useCallback, useEffect } from 'react';
import { DIRECTION_MAP } from '../utils/constants';
import { ArrowKeyType, Vector } from '../utils/types';

const isArrowKey = (key: string): key is ArrowKeyType =>
  key in DIRECTION_MAP;

// Rather than returning the direction, we pass the direction to the given callback
// so that keydown event won't make React rerender until the callback changes some states
const useArrowKeyPress = (cb: (dir: Vector) => void) => {
  const onKeyDown = useCallback(
    ({ key }: KeyboardEvent) => {
      if (isArrowKey(key)) {
        const dir = DIRECTION_MAP[key];
        if (dir) {
          cb(dir);
        }
      }
    },
    [cb],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);
};

export default useArrowKeyPress;
