import { useEffect, useMemo, useState } from "react";
import { Select } from "../../../../../components";
import { Images } from "../../../../../assets/images";
import { useAuthContext } from "../../../../../context";
import { TOKEN } from "../../../../../const";
import { FaKey, FaSeedling, FaExchangeAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { HiOutlineClipboardDocument } from "react-icons/hi2";

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
  const handleMainNetChange = (e: string | number) =>
    setMainNet(e.toString() as "FUSE" | "ETH" | "BNB" | "ARB" | "POL");
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
      const nativeBalance = await tokenList[mainNet].native.balance(
        user?.walletAddress ?? ""
      );
      const usdtBalance = await tokenList[mainNet].usdt.balance(
        user?.walletAddress ?? ""
      );
      const usdcBalance = await tokenList[mainNet].usdc.balance(
        user?.walletAddress ?? ""
      );
      setBalance({
        native: nativeBalance,
        usdt: usdtBalance,
        usdc: usdcBalance,
      });
    };
    fetchBalance();
  }, [mainNet]);
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[480px] min-w-[480px] rounded-lg bg-white/20 backdrop-blur-sm shadow-lg shadow-black/60 flex flex-col items-center justify-center gap-6 px-12 py-10 z-10 border border-white/10"
      >
        <img src={Images.WalletBg} alt="wallet" className="w-full h-full object-cover absolute top-0 left-0" />
        <div className="w-full h-full absolute top-0 left-0 bg-black/50 backdrop-blur-sm" />
        <div className="w-full flex items-center justify-center mb-2 relative z-10">
          <div className="text-3xl text-white font-bold flex items-center gap-4">
            <img src={Images.WalletLogo} alt="wallet" className="w-16 rounded-full" />
            <span className="text-orange-400">
             Wallet Information
            </span>
          </div>
        </div>
        
        <div className="flex w-full items-center justify-between rounded-lg  relative z-20">
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
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-white text-sm w-full font-bold bg-gray-800/60 px-3 py-1 rounded-md ml-2 transition-all h-10 flex items-center justify-between"
          >
            <HiOutlineClipboardDocument size={20} />
            {user?.walletAddress.slice(0, 5)} ...{" "}
            {user?.walletAddress.slice(39)}
          </motion.div>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md relative z-10"
        >
          <div className="flex items-center gap-3">
            {tokenList[mainNet].native.icon}
            <span className="text-white text-lg">{tokenList[mainNet].native.unit}</span>
          </div>
          <div className="text-white text-xl font-bold">
            {balance.native || "0.00"}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md relative z-10"
        >
          <div className="flex items-center gap-3">
            {tokenList[mainNet].usdt.icon}
            <span className="text-white text-lg">{tokenList[mainNet].usdt.unit}</span>
          </div>
          <div className="text-white text-xl font-bold">
            {balance.usdt || "0.00"}
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center justify-between bg-gray-800/60 p-4 rounded-lg border border-white/10 shadow-md relative z-10"
        >
          <div className="flex items-center gap-3">
            {tokenList[mainNet].usdc.icon}
            <span className="text-white text-lg">{tokenList[mainNet].usdc.unit}</span>
          </div>
          <div className="text-white text-xl font-bold">
            {balance.usdc || "0.00"}
          </div>
        </motion.div>
        
        <div className="w-full grid grid-cols-1 gap-3 mt-2 relative z-10">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-full bg-gray-800/60 text-white text-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <FaExchangeAlt /> Import Wallet
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-full bg-gray-800/60 text-white text-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <FaKey /> Show Private Key
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 rounded-full bg-gray-800/60 text-white text-xl font-bold transition flex items-center justify-center gap-2 shadow-lg"
          >
            <FaSeedling /> Show Seed Phrase
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
