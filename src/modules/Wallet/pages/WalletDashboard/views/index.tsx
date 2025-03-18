import { useNavigate } from "react-router-dom";
import { Images } from "../../../../../assets/images";
import { CheckBox } from "../../../../../components";
import { useOpen } from "../../../../../hooks";
import { PATH } from "../../../../../const";

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
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="border-2 border-white/20 min-w-[480px] max-w-[480px] min-h-2/3 rounded-lg bg-white/20 backdrop-blur-sm shadow-sm shadow-white/40 flex flex-col items-center justify-center gap-4 px-16 py-16">
        <img
          src={Images.WalletBg}
          alt="wallet"
          className="w-full h-auto absolute top-0 left-0 z-10 rounded-lg"
        />
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-black/50" />
        <div className="text-5xl text-nowrap text-yellow-400 font-bold relative z-20">
          Let's get started
        </div>
        <div className="text-lg text-white/80 relative z-20">
          Create your wallet to start playing
        </div>
        <img
          src={Images.WalletLogo}
          alt="wallet"
          className="w-[320px] relative z-20"
        />
        <div className="flex items-end gap-2 relative z-20">
          <CheckBox isOpen={isOpen} onToggle={onToggle} size={32} />
          <div className="text text-white/80">
            I agree to DWAT Wallet's Terms of use
          </div>
        </div>
        <button
          disabled={!isOpen}
          onClick={handleCreateNewWallet}
          className={
            "create-new-wallet relative z-20 h-[71px] w-[352px] cursor-none"
          }
        />
        <button
          disabled={!isOpen}
          onClick={handleImportExistWallet}
          className="import-existing-wallet relative z-20 h-[71px] w-[352px] cursor-none"
        />
      </div>
    </div>
  );
};
