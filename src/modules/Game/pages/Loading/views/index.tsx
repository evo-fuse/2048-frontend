import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATH } from "../../../../../const";
import { useAuthContext } from "../../../../../context";

export const LoadingView: React.FC = () => {
  const navigate = useNavigate();
  const { handleExistWallet, handleGetWalletAddress, setUser, handleUser } =
    useAuthContext();
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const exist = await handleExistWallet();
        if (exist) {
          setLoadingText("Getting wallet address...");
          const walletAddress = await handleGetWalletAddress();
          localStorage.setItem("token", walletAddress);
          const userData = await handleUser(walletAddress);
          setUser({ ...userData, address: walletAddress });
          navigate(PATH.GAME);
        } else {
          setLoadingText("Creating wallet...");
          navigate(PATH.WALLET_CREATION);
        }
      } catch (err: any) {
        if (err.status === 401) {
          localStorage.removeItem("token");
          navigate(PATH.HOME);
        }
      }
    };
      handleAuth();
  }, [navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center text-7xl font-bold relative text-orange-500">
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10">{loadingText}</div>
    </div>
  );
};
