import { useNavigate } from "react-router-dom";
import { Images } from "../../../../../assets/images";
import { useOpen } from "../../../../../hooks";
import { PATH } from "../../../../../const";

// Custom checkbox component
interface CheckBoxProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ isOpen, onToggle }) => {
  return (
    <div
      className={`w-3rem h-3rem border-2 rounded-md flex items-center justify-center transition-all duration-200 ${isOpen
        ? "bg-gray-700 border-gray-500"
        : "bg-transparent border-gray-500"
        }`}
      onClick={onToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="min-h-4 min-w-4 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isOpen && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        )}
      </svg>
    </div>
  );
};

export const WalletDashboardView = () => {
  const { isOpen, onToggle } = useOpen();
  const navigate = useNavigate();
  const handleCreateNewWallet = () => {
    navigate(PATH.WALLET_CREATION + PATH.SEED_CREATION);
  };
  const handleImportExistWallet = () => {
    navigate(PATH.WALLET_CREATION + PATH.IMPORT_EXIST_WALLET);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br p-8">
      {/* Main glass container */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-8">
        {/* Header section */}
        <div className="text-center space-y-3">
          <div className="text-4xl font-bold text-white tracking-tight">
            Let's get started
          </div>
          <div className="text-base text-white/70 font-medium">
            Create your wallet to start playing
          </div>
        </div>

        {/* Wallet logo */}
        <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
          <img
            src={Images.WalletLogo}
            alt="wallet"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Terms agreement */}
        <div className="flex items-end justify-center gap-3 w-full">
          <CheckBox isOpen={isOpen} onToggle={onToggle} />
          <div className="text-sm text-white/80 leading-relaxed">
            I agree to DWAT Wallet's Terms of use
          </div>
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-4">
          <button
            disabled={!isOpen}
            onClick={handleCreateNewWallet}
            className={`w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isOpen
              ? "bg-gradient-to-r from-gray-700 to-gray-900 shadow-lg shadow-gray-700/25 hover:shadow-gray-700/40"
              : "bg-white/10 text-white/50 cursor-none"
              }`}
          >
            Create New Wallet
          </button>

          <button
            disabled={!isOpen}
            onClick={handleImportExistWallet}
            className={`w-full h-14 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isOpen
              ? "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30"
              : "bg-white/5 text-white/30 border border-white/10 cursor-none"
              }`}
          >
            Import Existing Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
