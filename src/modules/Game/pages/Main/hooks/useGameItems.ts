import { useCallback } from "react";
import { useAuthContext } from "../../../../../context";

export const useGameItems = () => {
  const { user, handleUpdateUser } = useAuthContext();
  const useItem = useCallback((itemId: 'hammer' | 'upgrade' | 'powerup') => {
    if(user?.[itemId] && user?.[itemId] > 0) {
        handleUpdateUser({
            [itemId]: user[itemId] - 1,
        })
    }
  }, []);


  return { useItem };
};
