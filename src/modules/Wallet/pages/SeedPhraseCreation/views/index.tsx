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
    <div className="flex items-center gap-2 text-white">
      <HiOutlineClipboardDocument size={20} /> Copy to Clipboard
    </div>,
    <div className="flex items-center gap-2 text-gray-100">
      <HiOutlineClipboardDocumentCheck size={20} /> Copied
    </div>
  );
  const handleNext = () => navigate(PATH.WALLET_CREATION + PATH.SEED_CONFIRM);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-[520px] min-w-[520px] overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl flex flex-col items-center justify-center gap-6 px-12 py-10">
        <div className="text-2xl text-gray-100 font-medium text-center">
          Write down your Secret Recovery Phrase
        </div>
        
        <img src={Images.WalletLogo} alt="wallet" className="w-80 relative z-20" />
        
        <div className="w-full grid grid-cols-4 gap-3">
          {seedPhrase.split(" ").map((seed, idx) => (
            <div
              key={idx}
              className="px-3 py-2 text-gray-100 text-sm rounded-lg text-center bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 font-mono"
            >
              {seed}
            </div>
          ))}
        </div>
        
        <div
          onClick={onClick}
          className="flex w-full justify-end items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {content}
        </div>
        
        <button
          onClick={handleNext}
          disabled={!isCopied}
          className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
            isCopied
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
              : "bg-gray-700/50 text-gray-500"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
