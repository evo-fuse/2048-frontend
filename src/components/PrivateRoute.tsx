import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../const";
import { useAuthContext } from "../context";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * PrivateRoute component
 *
 * This component is used to protect routes that require authentication.
 * It checks if the user has a wallet and fetches user data.
 *
 * If the user has a wallet:
 *   - Renders the child routes using <Outlet />
 * If the user does not have a wallet:
 *   - Redirects to wallet creation page
 */
export const PrivateRoute = () => {
  const {
    user,
    handleExistWallet,
    handleGetWalletAddress,
    handleUser,
    setUser,
  } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const exist = await handleExistWallet();
        if (exist) {
          const walletAddress = await handleGetWalletAddress();
          localStorage.setItem("token", walletAddress);
          const userData = await handleUser(walletAddress);
          setUser({ ...userData, address: walletAddress });
          setIsLoading(false);
        } else {
          navigate(PATH.WALLET_CREATION, {
            state: { from: location },
            replace: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate(PATH.WALLET_CREATION, {
          state: { from: location },
          replace: true,
        });
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 text-white">
        <span className="text-2xl font-bold">Checking Wallet...</span>
        <div className="w-96 h-2 bg-white rounded-full mt-4 relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gray-500 rounded-full"
            style={{ width: "25%" }}
            initial={{ x: -96 }}
            animate={{ x: 384 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  return user ? (
    <Outlet />
  ) : (
    <Navigate to={PATH.WALLET_CREATION} state={{ from: location }} replace />
  );
};
