import { Outlet } from "react-router-dom";
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
    handleExistWallet,
    handleGetWalletAddress,
    handleUser,
    setUser,
    setExist,
  } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const existence = await handleExistWallet();
        setExist(existence);
        console.log("existence", existence);
        if (existence) {
          const walletAddress = await handleGetWalletAddress();
          localStorage.setItem("token", walletAddress);
          const userData = await handleUser(walletAddress);
          setUser({ ...userData });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      finally {
        setIsLoading(false);
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

  return <Outlet />;
};
