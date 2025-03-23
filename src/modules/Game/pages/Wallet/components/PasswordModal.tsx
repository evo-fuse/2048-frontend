import { useMemo } from "react";
import Modal from "../../../../../components/Modal";
import { WalletItem } from "../../../../../types";
import { ImportWallet } from "./ImportWallet";
import { useAuthContext } from "../../../../../context";
import { ShowPrivateKey } from "./ShowPrivateKey";
import { ShowSeed } from "./ShowSeed";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: WalletItem;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  title,
}) => {
  const {
    user,
    setUser,
    handleCreateWallet,
    handleGetPrivateKey,
    handleGetSeed,
  } = useAuthContext();
  const modalBody = useMemo(
    () => ({
      [WalletItem.Import]: {
        body: (
          <ImportWallet
            handleCreateWallet={handleCreateWallet}
            user={user}
            setUser={setUser}
            onClose={onClose}
          />
        ),
        width: "max-w-lg",
      },
      [WalletItem.ShowPrivateKey]: {
        body: (
          <ShowPrivateKey
            handleGetPrivateKey={handleGetPrivateKey}
            email={user?.email || ""}
            onClose={onClose}
          />
        ),
        width: "max-w-2xl",
      },
      [WalletItem.ShowSeed]: {
        body: (
          <ShowSeed
            handleGetSeed={handleGetSeed}
            email={user?.email || ""}
            onClose={onClose}
          />
        ),
        width: "max-w-lg",
      },
    }),
    [title, handleCreateWallet, handleGetPrivateKey, handleGetSeed, user, onClose]
  );
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={modalBody[title].width}
    >
      {modalBody[title].body}
    </Modal>
  );
};
