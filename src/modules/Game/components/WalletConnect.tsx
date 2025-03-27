import { useState } from "react";
import { useAuthContext } from "../../../context";
import Modal from "../../../components/Modal";

interface WalletConnectProps {
  handleGetPrivateKey: (password: string) => Promise<any>;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  handleGetPrivateKey,
  isOpen,
  onClose,
  title,
}) => {
  const [password, setPassword] = useState("");
  const { setPrivateKey } = useAuthContext();
  const [error, setError] = useState("");

  const handleModalClose = () => {
    setPassword("");
    setError("");
    onClose();
  }

  const handlePrivateKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await handleGetPrivateKey(password);
      setPrivateKey(data);
      setPassword("");
      handleModalClose();
    } catch (err: any) {
      if (password === "") setError("Password is required");
      else setError("Password is incorrect");
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={title || "To Buy Items, Connect Wallet"}
      closeOnOutsideClick
    >
      <div className="w-full px-4 pb-4 flex flex-col gap-4">
        <form className="flex flex-col gap-2" onSubmit={handlePrivateKey}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 rounded-md bg-transparent px-3 border border-white/10 py-1 text-white focus:outline-none"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-gray-600/60 px-3 py-1 text-white focus:outline-none disabled:opacity-50 disabled:hover:bg-gray-600/60 hover:bg-gray-600/80 transition-colors cursor-none"
          >
            Enter
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default WalletConnect;
