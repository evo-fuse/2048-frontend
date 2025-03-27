import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

import { useState } from "react";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { useClipboard } from "../../../../../hooks";

interface ShowPrivateKeyProps {
  handleGetPrivateKey: (password: string) => Promise<any>;
  onClose: () => void;
}

export const ShowPrivateKey: React.FC<ShowPrivateKeyProps> = ({
  handleGetPrivateKey,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");

  // Create the content outside the hook
  const normalContent = (
    <div className="text-white flex items-center gap-2">
      <HiOutlineClipboardDocument size={24} />
    </div>
  );

  const copiedContent = (
    <div className="text-white flex items-center gap-2">
      <HiOutlineClipboardDocumentCheck size={24} />
    </div>
  );

  const { onClick, content } = useClipboard(
    privateKey,
    normalContent,
    copiedContent
  );

  const handlePrivateKey = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await handleGetPrivateKey(password);
      setPrivateKey(data);
    } catch (err: any) {
      setError(err.response.data.error);
    }
  };
  return (
    <div className="w-full px-4 pb-4 flex flex-col gap-4">
      {privateKey ? (
        <>
          <div
            className="flex items-center justify-between text-white"
            onClick={onClick}
          >
            {privateKey}
            {content}
          </div>
          <button
            onClick={onClose}
            className="w-full h-10 rounded-md bg-gray-600/60 px-3 py-1 text-white focus:outline-none disabled:opacity-50 disabled:hover:bg-gray-600/60 hover:bg-gray-600/80 transition-colors cursor-none"
          >
            Close
          </button>
        </>
      ) : (
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
      )}
    </div>
  );
};
