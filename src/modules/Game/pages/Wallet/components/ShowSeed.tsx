import { HiOutlineClipboardDocumentCheck } from "react-icons/hi2";

import { HiOutlineClipboardDocument } from "react-icons/hi2";

import { useState } from "react";
import { useClipboard } from "../../../../../hooks";

interface ShowSeedProps {
  handleGetSeed: (password: string) => Promise<any>;
  onClose: () => void;
}
export const ShowSeed: React.FC<ShowSeedProps> = ({
  handleGetSeed,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [seed, setSeed] = useState("");
  const [error, setError] = useState("");
  const { onClick, content } = useClipboard(
    seed,
    <div className="text-white flex items-center gap-2">
      <HiOutlineClipboardDocument size={24} /> Copy Seed Phrase
    </div>,
    <div className="text-white flex items-center gap-2">
      <HiOutlineClipboardDocumentCheck size={24} /> Copied Seed Phrase
    </div>
  );
  const handleSeed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const seed = await handleGetSeed(password);
      setSeed(seed);
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <div className="w-full px-4 pb-4 flex flex-col gap-2">
      {seed ? (
        <>
          <div className="w-full grid grid-cols-3 gap-2">
            {seed.split(" ").map((item: string, idx: number) => (
              <div
                key={`${item}-${idx}`}
                className="text-white font-bold border border-white/10 rounded-md px-2 py-1"
              >
                {idx + 1}. {item}
              </div>
            ))}
          </div>
          <div
            onClick={onClick}
            className="flex items-center justify-end w-full text-white"
          >
            {content}
          </div>
          <button
            onClick={onClose}
            className="w-full h-10 rounded-md bg-gray-600/60 px-3 py-1 text-white focus:outline-none"
          >
            Close
          </button>
        </>
      ) : (
        <form className="flex flex-col gap-2" onSubmit={handleSeed}>
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
            className="w-full h-10 rounded-md bg-gray-600/60 px-3 py-1 text-white focus:outline-none"
          >
            Enter
          </button>
        </form>
      )}
    </div>
  );
};
