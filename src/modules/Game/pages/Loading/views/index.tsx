import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATH } from "../../../../../const";
import { useAuth, useClerk, useSession } from "@clerk/clerk-react";
import { useAuthContext } from "../../../../../context";

export const LoadingView: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const { handleUser, handleExistWallet, handleGetWalletAddress, setUser } = useAuthContext();
  const { signOut } = useClerk();
  const { session } = useSession();
  const [loadingText, setLoadingText] = useState("Loading...");
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const jwt = await session?.getToken({ template: "signin" });
        localStorage.setItem("token", jwt || "");
        setLoadingText("Checking user...");
        const userData = await handleUser();
        setLoadingText("Checking wallet...");
        const exist = await handleExistWallet(userData.email);
        if (exist) {
          setLoadingText("Getting wallet address...");
          const walletAddress = await handleGetWalletAddress(userData.email);
          setUser({ ...userData, walletAddress });
          navigate(PATH.GAME);
        } else {
          setLoadingText("Creating wallet...");
          setUser({ ...userData });
          navigate(PATH.WALLET_CREATION);
        }
      } catch (err: any) {
        if (err.status === 401) {
          signOut(() => {
            localStorage.removeItem("token");
            navigate(PATH.HOME);
          });
        }
      }
    };
    if (isLoaded && isSignedIn && session) {
      handleAuth();
    }
  }, [isSignedIn, isLoaded, navigate, signOut, session]);

  return (
    <div className="w-full h-full flex items-center justify-center text-7xl font-bold relative text-orange-500">
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10">{loadingText}</div>
    </div>
  );
};
