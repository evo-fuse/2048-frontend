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
    <div className="flex items-center gap-2">
      <HiOutlineClipboardDocument size={24} /> Copy to Clipboard
    </div>,
    <div className="flex items-center gap-2">
      <HiOutlineClipboardDocumentCheck size={24} /> Clipboard Copied
    </div>
  );
  const handleNext = () => navigate(PATH.WALLET_CREATION + PATH.SEED_CONFIRM);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <div className="border-2 border-white/20 max-w-[480px] min-w-[480px] overflow-hidden min-h-2/3 rounded bg-white/20 backdrop-blur-sm shadow-md shadow-black/60 flex flex-col items-center justify-center gap-4 px-16 py-8">
        <img
          src={Images.WalletBg}
          alt="wallet"
          className="w-full h-auto absolute top-0 left-0 z-10 rounded-lg"
        />
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-black/50" />
        <div className="text-3xl text-yellow-400 font-bold text-center relative z-20">
          Write down your Secret Recovery Phrase.
        </div>
        <img src={Images.WalletLogo} alt="wallet" className="w-80 relative z-20" />
        <div className="w-full grid grid-cols-4 gap-2 relative z-20">
          {seedPhrase.split(" ").map((seed, idx) => (
            <input
              type="text"
              value={seed}
              key={idx}
              disabled
              className="cursor-none px-2 py-1 text-white text-sm rounded-md text-center bg-black/40 backdrop-blur-sm"
            />
          ))}
        </div>
        <div
          onClick={onClick}
          className="flex w-full justify-end items-center text-white gap-2 relative z-20"
        >
          {content}
        </div>
        <button
          onClick={handleNext}
          disabled={!isCopied}
          className="next relative z-20 h-[71px] w-[352px] cursor-none"
        >
        </button>
      </div>
    </div>
  );
};
