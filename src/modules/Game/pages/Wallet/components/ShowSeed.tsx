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
    <div className="flex items-center gap-2 px-4 py-2 rounded-md text-cyan-600 hover:text-cyan-500 transition-colors shadow-lg shadow-cyan-500/30 cursor-pointer">
      <HiOutlineClipboardDocument size={24} /> Copy Seed Phrase
    </div>,
    <div className="flex items-center gap-2 px-4 py-2 rounded-md text-cyan-500">
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
                className="text-cyan-200 font-bold border border-cyan-400/30 bg-cyan-900/20 rounded-md px-2 py-1"
              >
                {idx + 1}. {item}
              </div>
            ))}
          </div>
          <div
            onClick={onClick}
            className="flex items-center justify-end w-full"
          >
            {content}
          </div>
          <button
            onClick={onClose}
            className="w-full h-10 rounded-md bg-cyan-600 hover:bg-cyan-500 px-3 py-1 text-white transition-colors shadow-lg shadow-cyan-500/30 border border-cyan-400/30"
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
            className="w-full h-10 rounded-md bg-cyan-900/20 px-3 border border-cyan-400/20 py-1 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:bg-cyan-800/30 transition-colors"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full h-10 rounded-md bg-cyan-600 hover:bg-cyan-500 px-3 py-1 text-white transition-all shadow-lg shadow-cyan-500/30 border border-cyan-400/30 font-medium"
          >
            Enter
          </button>
        </form>
      )}
    </div>
  );
};
