import { useNavigate } from "react-router-dom";
import { Images } from "../../../../../assets/images";
import { useClipboard } from "../../../../../hooks";
import { useWalletCreationContext } from "../../../context";
import {
  HiOutlineClipboardDocument,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import { PATH } from "../../../../../const";

export const SeedPhraseCreationView: React.FC = () => {
  const { seedPhrase } = useWalletCreationContext();
  const navigate = useNavigate();
  const { onClick, isCopied, content } = useClipboard(
    seedPhrase,
    <div className="flex items-center gap-2 text-cyan-300/80">
      <HiOutlineClipboardDocument size={20} /> Copy to Clipboard
    </div>,
    <div className="flex items-center gap-2 text-cyan-200">
      <HiOutlineClipboardDocumentCheck size={20} /> Copied
    </div>
  );
  const handleNext = () => navigate(PATH.WALLET_CREATION + PATH.SEED_CONFIRM);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center p-8">
      <div className="max-w-[520px] min-w-[520px] overflow-hidden rounded-3xl bg-cyan-500/10 backdrop-blur-xl border border-cyan-400/30 shadow-2xl flex flex-col items-center justify-center gap-8 px-12 py-10">
        <div className="text-3xl text-white font-bold tracking-tight text-center">
          Write down your Secret Recovery Phrase
        </div>

        <img src={Images.WalletLogo} alt="wallet" className="w-36 relative z-20" />

        <div className="w-full grid grid-cols-4 gap-3">
          {seedPhrase.split(" ").map((seed, idx) => (
            <div
              key={idx}
              className="px-3 py-2 text-white text-sm rounded-xl text-center bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 font-mono"
            >
              {seed}
            </div>
          ))}
        </div>

        <div
          onClick={onClick}
          className="flex w-full justify-end items-center gap-2 text-cyan-300/80 hover:text-cyan-200 transition-colors cursor-pointer"
        >
          {content}
        </div>

        <button
          onClick={handleNext}
          disabled={!isCopied}
          className={`w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isCopied
            ? "bg-gradient-to-r from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 border border-cyan-400/30"
            : "bg-cyan-500/10 text-cyan-300/50 cursor-none border border-cyan-400/20"
            }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
