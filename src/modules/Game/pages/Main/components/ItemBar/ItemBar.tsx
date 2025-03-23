import React from "react";
// import { useGameItems } from "../../hooks/useGameItems";
import { ItemButton } from "./ItemButton";
import { Images } from "../../../../../../assets/images";
import { useAuthContext } from "../../../../../../context";
import { useGameContext } from "../../../../context/GameContext";
import { useOpen } from "../../../../../../hooks";

export const ItemBar: React.FC = () => {
  // const { useItem } = useGameItems();
  const { user, setCursor, cursor, handleUpdateItem, setUser } =
    useAuthContext();
  const { setShowPowerupAnimation, setPowerup, powerup } = useGameContext();
  const { isOpen, onOpen, onClose } = useOpen();

  return (
    <div className="flex justify-evenly gap-3 p-3 bg-black/40 rounded-lg mt-4">
      <ItemButton
        item={{
          id: "hammer",
          icon: Images.HAMMER,
          quantity: user?.hammer || 0,
        }}
        onClick={() => {
          cursor === Images.HAMMER
            ? setCursor(Images.Cursor)
            : setCursor(Images.HAMMER);
        }}
      />
      <ItemButton
        item={{
          id: "upgrade",
          icon: Images.UPGRADE,
          quantity: user?.upgrade || 0,
        }}
        onClick={() => {
          cursor === Images.UPGRADE
            ? setCursor(Images.Cursor)
            : setCursor(Images.UPGRADE);
        }}
      />
      <ItemButton
        item={{
          id: "powerup",
          icon: Images.POWER_UP,
          quantity: user?.powerup || 0,
        }}
        loading={isOpen}
        onClick={() => {
          if (powerup === 0 && user) {
            onOpen();
            setUser({ ...user, powerup: user.powerup - 1 });
            setPowerup(20);
            setShowPowerupAnimation(true);
            setTimeout(() => setShowPowerupAnimation(false), 750);
            handleUpdateItem("powerup", -1).finally(() => onClose());
          }
        }}
      />
    </div>
  );
};
