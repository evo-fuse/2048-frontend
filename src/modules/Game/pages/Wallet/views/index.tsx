import { useEffect, useMemo, useState } from "react";
import { Select } from "../../../../../components";
import { Images } from "../../../../../assets/images";
import { useAuthContext } from "../../../../../context";
import { TOKEN } from "../../../../../const";
import { motion } from "framer-motion";
import {
  HiOutlineClipboardDocument,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineKey,
  HiOutlineDocumentDuplicate,
  HiOutlineWallet,
} from "react-icons/hi2";
import { useClipboard, useOpen } from "../../../../../hooks";
import { PasswordModal } from "../components";
import { WalletItem } from "../../../../../types";
import { useWeb3Context } from "../../../../../context/Web3Context";

export const WalletView: React.FC = () => {
  const { user } = useAuthContext();
  const [mainNet, setMainNet] = useState<
    "FUSE" | "ETH" | "BNB" | "ARB" | "POL"
  >("FUSE");
  const [balance, setBalance] = useState<{
    native: string;
    usdt: string;
    usdc: string;
  }>({ native: "", usdt: "", usdc: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleMainNetChange = (e: string | number) => {
    setMainNet(e.toString() as "FUSE" | "ETH" | "BNB" | "ARB" | "POL");
  };
  
  const tokenList = useMemo(() => {
    return {
      FUSE: { native: TOKEN.FUSE, usdt: TOKEN.FUSDT, usdc: TOKEN.FUSDC },
      ETH: { native: TOKEN.ETH, usdt: TOKEN.EUSDT, usdc: TOKEN.EUSDC },
      BNB: { native: TOKEN.BNB, usdt: TOKEN.BUSDT, usdc: TOKEN.BUSDC },
      ARB: { native: TOKEN.ARB, usdt: TOKEN.AUSDT, usdc: TOKEN.AUSDC },
      POL: { native: TOKEN.POL, usdt: TOKEN.PUSDT, usdc: TOKEN.PUSDC },
    };
  }, []);
  
  useEffect(() => {
    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const nativeBalance = await tokenList[mainNet].native.balance(
          user?.address ?? ""
        );
        const usdtBalance = await tokenList[mainNet].usdt.balance(
          user?.address ?? ""
        );
        const usdcBalance = await tokenList[mainNet].usdc.balance(
          user?.address ?? ""
        );
        setBalance({
          native: nativeBalance,
          usdt: usdtBalance,
          usdc: usdcBalance,
        });
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [mainNet, tokenList, user?.address]);
  
  const { userBalance, getBalance } = useWeb3Context();
  
  useEffect(() => {
    getBalance();
  }, [getBalance]);
  
  const { isOpen, onOpen, onClose } = useOpen();
  const [title, setTitle] = useState<WalletItem>(WalletItem.Import);
  const { content, onClick } = useClipboard(
    user?.address ?? "",
    <HiOutlineClipboardDocument size={20} />,
    <HiOutlineClipboardDocumentCheck size={20} color="#4ade80" />
  );

  const handleRefresh = () => {
    getBalance();
    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const nativeBalance = await tokenList[mainNet].native.balance(
          user?.address ?? ""
        );
        const usdtBalance = await tokenList[mainNet].usdt.balance(
          user?.address ?? ""
        );
        const usdcBalance = await tokenList[mainNet].usdc.balance(
          user?.address ?? ""
        );
        setBalance({
          native: nativeBalance,
          usdt: usdtBalance,
          usdc: usdcBalance,
        });
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <PasswordModal isOpen={isOpen} onClose={onClose} title={title} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[480px] min-w-[480px] rounded-lg bg-white/20 backdrop-blur-sm shadow-lg shadow-black/60 flex flex-col items-center justify-center gap-4 px-8 py-6 z-10 border border-white/10"
      >
        <div className="w-full h-full absolute top-0 left-0 bg-black/50 backdrop-blur-sm rounded-lg" />
        
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2 relative z-10">
          <div className="text-2xl text-white font-bold flex items-center gap-3">
            <img
              src={Images.WalletLogo}
              alt="wallet"
              className="w-12 h-12 rounded-full"
            />
            <span className="text-white">My Wallet</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-gray-700/60 text-white ${isLoading ? 'animate-spin' : ''}`}
            disabled={isLoading}
          >
            <HiOutlineArrowPathRoundedSquare size={20} />
          </motion.button>
        </div>
        
        {/* Address and Network selector */}
        <div className="flex flex-col w-full gap-2 relative z-20">
          <div className="text-white/70 text-xs font-medium">Your Address</div>
          <motion.div
            onClick={onClick}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
            className="text-white text-sm w-full font-medium bg-gray-800/60 px-4 py-3 rounded-lg border border-white/10 transition-all flex items-center justify-between"
          >
            <span className="truncate mr-2">
              {user?.address}
            </span>
            {content}
          </motion.div>
          
          <div className="text-white/70 text-xs font-medium mt-2">Network</div>
          <Select
            options={[
              {
                value: "FUSE",
                label: (
                  <div className="w-full flex text-sm items-center gap-2">
                    <img src={Images.FUSE} className="w-6 h-6 rounded-full" />
                    Fuse Mainnet
                  </div>
                ),
              },
              {
                value: "ETH",
                label: (
                  <div className="w-full flex text-sm items-center gap-2">
                    <img src={Images.ETH} className="w-6 h-6 rounded-full" />
                    Ethereum Mainnet
                  </div>
                ),
              },
              {
                value: "BNB",
                label: (
                  <div className="w-full text-sm flex items-center gap-2">
                    <img src={Images.BNB} className="w-6 h-6 rounded-full" />
                    Binance Mainnet
                  </div>
                ),
              },
              {
                value: "ARB",
                label: (
                  <div className="w-full text-sm flex items-center gap-2">
                    <img src={Images.ARB} className="w-6 h-6 rounded-full" />
                    Arbitrum Mainnet
                  </div>
                ),
              },
              {
                value: "POL",
                label: (
                  <div className="w-full text-sm flex items-center gap-2">
                    <img src={Images.POL} className="w-6 h-6 rounded-full" />
                    Polygon Mainnet
                  </div>
                ),
              },
            ]}
            value={mainNet}
            placeholder="Choose Mainnet"
            onChange={handleMainNetChange}
          />
        </div>
        
        {/* Assets section */}
        <div className="w-full relative z-10 mt-2">
          <div className="text-white/70 text-xs font-medium mb-2">Assets</div>
          
          {isLoading ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <div className="animate-pulse text-white/50">Loading balances...</div>
            </div>
          ) : (
            <>
              {mainNet === "FUSE" && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md mb-2"
                >
                  <div className="flex items-center gap-3">
                    <img src={Images.DWAT} className="w-8 h-8 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-white text-lg">DWAT</span>
                      <span className="text-white/60 text-xs">Game Token</span>
                    </div>
                  </div>
                  <div className="text-white text-xl font-bold">
                    {userBalance || "0.00"}
                  </div>
                </motion.div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md mb-2"
              >
                <div className="flex items-center gap-3">
                  {tokenList[mainNet].native.icon}
                  <div className="flex flex-col">
                    <span className="text-white text-lg">{tokenList[mainNet].native.unit}</span>
                    <span className="text-white/60 text-xs">Native Token</span>
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  {balance.native || "0.00"}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md mb-2"
              >
                <div className="flex items-center gap-3">
                  {tokenList[mainNet].usdt.icon}
                  <div className="flex flex-col">
                    <span className="text-white text-lg">{tokenList[mainNet].usdt.unit}</span>
                    <span className="text-white/60 text-xs">Stablecoin</span>
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  {balance.usdt || "0.00"}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md"
              >
                <div className="flex items-center gap-3">
                  {tokenList[mainNet].usdc.icon}
                  <div className="flex flex-col">
                    <span className="text-white text-lg">{tokenList[mainNet].usdc.unit}</span>
                    <span className="text-white/60 text-xs">Stablecoin</span>
                  </div>
                </div>
                <div className="text-white text-xl font-bold">
                  {balance.usdc || "0.00"}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="w-full relative z-10 mt-2">
          <div className="text-white/70 text-xs font-medium mb-2">Wallet Actions</div>
          <div className="w-full grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center gap-2 p-4 transition bg-gray-800/60 text-white rounded-lg border border-white/10 shadow-md"
              onClick={() => {
                setTitle(WalletItem.Import);
                onOpen();
              }}
            >
              <HiOutlineWallet size={24} />
              <span className="text-sm font-medium">Import</span>
            </motion.button>

            <motion.button
              onClick={() => {
                setTitle(WalletItem.ShowPrivateKey);
                onOpen();
              }}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center gap-2 p-4 transition bg-gray-800/60 text-white rounded-lg border border-white/10 shadow-md"
            >
              <HiOutlineKey size={24} />
              <span className="text-sm font-medium">Private Key</span>
            </motion.button>

            <motion.button
              onClick={() => {
                setTitle(WalletItem.ShowSeed);
                onOpen();
              }}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center justify-center gap-2 p-4 transition bg-gray-800/60 text-white rounded-lg border border-white/10 shadow-md"
            >
              <HiOutlineDocumentDuplicate size={24} />
              <span className="text-sm font-medium">Seed Phrase</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
