import { useAuthContext } from "../../../context";
import { Navbar } from "../components";
import WalletConnect from "../components/WalletConnect";
import { useGameContext } from "../context/GameContext";
import { Images } from "../../../assets/images";
import { GridSparkles } from "../../../components";
import { useLocation } from "react-router-dom";
import { PATH } from "../../../const";
import { RiErrorWarningLine } from "react-icons/ri";

interface BaseGameLayoutProps {
  children: React.ReactNode;
}

export const BaseGameLayout: React.FC<BaseGameLayoutProps> = ({ children }) => {
  const { isOpenWalletConnect, onCloseWalletConnect } = useGameContext();
  const { handleGetPrivateKey, privateKey } = useAuthContext();
  const location = useLocation();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 overflow-x-hidden">
      {!privateKey && (
        <div className="fixed top-0 left-0 w-full h-6 bg-yellow-400 text-white flex items-center justify-center z-20">
          <RiErrorWarningLine className="text-white size-4" />
          <span className="text-white text-sm ml-2 font-bold">
            {
              location.pathname === `${PATH.GAME}${PATH.SHOP}`
                ? "Hold your horses! 🐴 To go on a shopping spree, please connect your wallet first!"
                : location.pathname === `${PATH.GAME}${PATH.DEPOSIT}`
                  ? "Hold your horses! 🐴 To go on a deposit spree, please connect your wallet first!"
                  : "Hold your horses! 🐴 To go on a game spree, please connect your wallet first!"
            }
          </span>
        </div>
      )}
      <img
        src={Images.BACKGROUND}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      />
      <GridSparkles />
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm" />
      <div className="relative z-10 w-full h-full flex justify-start items-center mt-0 gap-4">
        <Navbar />
        <div className="flex flex-col gap-4 w-full h-full items-center justify-center p-8">
          <div className="relative w-full h-full overflow-hidden bg-black/20 border border-white/10 rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
      <WalletConnect
        isOpen={isOpenWalletConnect}
        onClose={onCloseWalletConnect}
        handleGetPrivateKey={handleGetPrivateKey}
      />
    </div>
  );
};

export const withBaseGameLayout = (Component: React.FC) => {
  return () => (
    <BaseGameLayout>
      <Component />
    </BaseGameLayout>
  );
};
