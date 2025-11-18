import { useNavigate } from "react-router-dom";
import { Images } from "../../../../../assets/images";
import { PATH } from "../../../../../const";

export const WalletDashboardView = () => {
  const navigate = useNavigate();
  const handleCreateNewWallet = () => {
    navigate(PATH.WALLET_CREATION + PATH.SEED_CREATION);
  };
  const handleImportExistWallet = () => {
    navigate(PATH.WALLET_CREATION + PATH.IMPORT_EXIST_WALLET);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {/* Main glass container */}
      <div className="w-full max-w-md backdrop-blur-xl bg-cyan-500/10 border border-cyan-400/20 rounded-3xl shadow-2xl shadow-cyan-500/20 p-8 flex flex-col items-center gap-8">
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
        <div className="w-36 h-36 bg-transparent rounded-2xl flex items-center justify-center">
          <img
            src={Images.WalletLogo}
            alt="wallet"
            className="w-36 h-36 object-contain"
          />
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={handleCreateNewWallet}
            className="w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40"
          >
            Create New Wallet
          </button>

          <button
            onClick={handleImportExistWallet}
            className="w-full h-14 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-cyan-500/10 text-white border border-cyan-400/20 hover:bg-cyan-500/20 hover:border-cyan-400/30"
          >
            Import Existing Wallet
          </button>
        </div>
      </div>
    </div>
  );
};
