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
    <div className="w-full h-full text-white flex gap-4">
      <PasswordModal isOpen={isOpen} onClose={onClose} title={title} />
      <div className="w-full h-full flex flex-col gap-6">
        {/* Header with gradient accent */}
        <div className="relative flex items-center justify-between">
          <h2 className="text-2xl font-bold py-6 px-8 border-b border-white/10 flex items-center gap-3 flex-1">
            <img
              src={Images.WalletLogo}
              alt="wallet"
              className="w-10 h-10 rounded-full"
            />
            My Wallet
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`p-2 rounded-full bg-gray-700/60 text-white mr-8 ${isLoading ? 'animate-spin' : ''}`}
            disabled={isLoading}
          >
            <HiOutlineArrowPathRoundedSquare size={20} />
          </motion.button>
        </div>

        <div className="px-8 flex flex-col gap-6 h-full">
          {/* Address and Network selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Your Address
              </label>
              <motion.div
                onClick={onClick}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
                className="text-white text-sm w-full font-medium bg-gray-800/60 px-4 py-3 rounded-lg border border-white/10 transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="truncate mr-2">
                  {user?.address}
                </span>
                {content}
              </motion.div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Network
              </label>
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
          </motion.div>

          {/* Assets section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Assets
            </label>

            {isLoading ? (
              <div className="w-full h-[200px] flex items-center justify-center">
                <div className="animate-pulse text-white/50">Loading balances...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainNet === "FUSE" && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md"
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
                  className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md"
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
                  className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md"
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
              </div>
            )}
          </motion.div>

          <div className="flex-1" />

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3 pb-4"
          >
            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Wallet Actions
            </label>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center gap-2 p-6 transition bg-gray-800/60 text-white rounded-lg border border-white/10 shadow-md hover:bg-gray-700/60"
                onClick={() => {
                  setTitle(WalletItem.Import);
                  onOpen();
                }}
              >
                <HiOutlineWallet size={28} />
                <span className="text-base font-medium">Import</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  setTitle(WalletItem.ShowPrivateKey);
                  onOpen();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center gap-2 p-6 transition bg-gray-800/60 text-white rounded-lg border border-white/10 shadow-md hover:bg-gray-700/60"
              >
                <HiOutlineKey size={28} />
                <span className="text-base font-medium">Private Key</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  setTitle(WalletItem.ShowSeed);
                  onOpen();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center gap-2 p-6 transition bg-gray-800/60 text-white rounded-lg border border-white/10 shadow-md hover:bg-gray-700/60"
              >
                <HiOutlineDocumentDuplicate size={28} />
                <span className="text-base font-medium">Seed Phrase</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
