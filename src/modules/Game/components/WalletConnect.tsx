import { useState } from "react";
import { useAuthContext } from "../../../context";
import Modal from "../../../components/Modal";

interface WalletConnectProps {
  handleGetPrivateKey: (password: string) => Promise<string>;
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
      title={title || "Connect Wallet"}
      closeOnOutsideClick
      className="border-cyan-400/30 bg-cyan-950/80"
    >
      <div className="w-full px-4 pb-4 flex flex-col gap-4">
        <form className="flex flex-col gap-2" onSubmit={handlePrivateKey}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 rounded-md bg-cyan-900/20 px-3 border border-cyan-400/20 py-1 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:bg-cyan-800/30 transition-colors"
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-cyan-600 hover:bg-cyan-500 px-3 py-1 text-white disabled:opacity-50 disabled:hover:bg-cyan-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 border border-cyan-400/30 font-medium cursor-none"
          >
            Unlock
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default WalletConnect;
