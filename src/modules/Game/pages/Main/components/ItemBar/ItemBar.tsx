import React from "react";

import { ItemButton } from "./ItemButton";
import { Images } from "../../../../../../assets/images";
import { useAuthContext } from "../../../../../../context";
import { useGameContext } from "../../../../context/GameContext";
import { useOpen } from "../../../../../../hooks";

interface ItemBarProps {
  handleOpenItemModal: (notice: string) => void;
}

export const ItemBar: React.FC<ItemBarProps> = ({ handleOpenItemModal }) => {
  const { user, setCursor, cursor, handleUpdateItem, setUser } =
    useAuthContext();
  const {
    setShowPowerupAnimation,
    setPowerup,
    powerup,
    itemUsage,
    setItemUsage,
  } = useGameContext();
  const { isOpen, onOpen, onClose } = useOpen();

  return (
    <div className="flex justify-evenly mt-4">
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
        direction="left"
      />
      <ItemButton
        item={{
          id: "upgrade",
          icon: Images.UPGRADE,
          quantity: user?.upgrade || 0,
        }}
        onClick={() => {
          if (itemUsage.upgrade) {
            handleOpenItemModal("You have already used the upgrade");
          } else if (user && user.upgrade > 0) {
            cursor === Images.UPGRADE
              ? setCursor(Images.Cursor)
              : setCursor(Images.UPGRADE);
          }
        }}
        direction="top"
      />
      <ItemButton
        item={{
          id: "powerup",
          icon: Images.POWER_UP,
          quantity: user?.powerup || 0,
        }}
        loading={isOpen}
        onClick={() => {
          if (itemUsage.powerup) {
            handleOpenItemModal("You have already used the powerup");
          } else if (powerup === 0 && user) {
            onOpen();
            setUser({ ...user, powerup: user.powerup - 1 });
            setPowerup(20);
            setShowPowerupAnimation(true);
            setTimeout(() => setShowPowerupAnimation(false), 750);
            handleUpdateItem("powerup", -1).finally(() => onClose());
            setItemUsage({ ...itemUsage, powerup: true });
          }
        }}
        direction="right"
      />
    </div>
  );
};
