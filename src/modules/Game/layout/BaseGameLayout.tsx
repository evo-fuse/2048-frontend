import { Images } from "../../../assets/images";
import { useAuthContext } from "../../../context";
import { Navbar } from "../components";
import WalletConnect from "../components/WalletConnect";
import { useGameContext } from "../context/GameContext";

interface BaseGameLayoutProps {
  children: React.ReactNode;
}

export const BaseGameLayout: React.FC<BaseGameLayoutProps> = ({ children }) => {
  const { isOpenWalletConnect, onCloseWalletConnect } = useGameContext();
  const { handleGetPrivateKey } = useAuthContext();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
      <img
        src={Images.Bg}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full h-full flex justify-start items-center mt-0">
        <Navbar />
        {children}
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
