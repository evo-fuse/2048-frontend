import { FaUnlock, FaLock, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context";
import { useGameContext } from "../context/GameContext";
import { Hex } from "./Hex";
import { formatAddress } from "../../../utils/address";
import { PATH } from "../../../const";
import { useState } from "react";

export const WalletConnectButton: React.FC = () => {
  const { privateKey, handleDisconnectWallet, exist } = useAuthContext();
  const { onOpenWalletConnect } = useGameContext();
  const navigate = useNavigate();
  const [isHover, setIsHover] = useState(false);

  const onCreateWalletConnect = () => {
    navigate(PATH.WALLET_CREATION);
  };

  const handleClick = () => {
    if (privateKey) {
      handleDisconnectWallet();
    } else if (exist) {
      onOpenWalletConnect();
    } else {
      onCreateWalletConnect();
    }
  };

  return (
    <div
      className="flex items-center relative transition-all duration-300"
      onClick={handleClick}
      style={{
        filter: isHover
          ? "drop-shadow(0 0 12px rgba(34, 211, 238, 1))"
          : "drop-shadow(0 0 12px rgba(34, 211, 238, 0))"
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Hex
        whileHover={{
          scale: 1.08,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.95 }}
        width={96}
        className={`z-20 relative left-12 ${privateKey || isHover ? "bg-cyan-400" : "bg-gray-600"} flex items-center justify-center transition-all`}
      >
        <Hex width={88} className="bg-gray-800 flex items-center justify-center">
          <Hex width={80} className={`${privateKey || isHover ? "bg-cyan-500/75" : "bg-white/30"} flex items-center justify-center transition-all`}>
            <Hex width={72} className="bg-gray-800 flex items-center justify-center">
              {privateKey ? <FaUnlock color="white" size={24} /> : exist ? <FaLock color="white" size={24} /> : <FaPlus color="white" size={24} />}
            </Hex>
          </Hex>
        </Hex>
      </Hex>
      <div className={`z-10 relative w-52 h-16 ${privateKey || isHover ? "bg-cyan-400" : "bg-gray-600"} flex items-center transition-all`}>
        <div className="w-52 h-14 bg-gray-800 flex items-center">
          <div className={`w-52 h-12 ${privateKey || isHover ? "bg-cyan-500/75" : "bg-white/30"} flex items-center transition-all`}>
            <div className="w-52 h-10 bg-gray-800 flex items-center">
              <label className={`text-white relative ${privateKey ? "left-[64px]" : exist ? "left-[52px]" : "left-[90px]"}`}>
                {privateKey
                  ? formatAddress(localStorage.getItem("token") || "")
                  : exist ? "Wallet disconnected" : "No Wallet"
                }
              </label>
            </div>
          </div>
        </div>
      </div>
      <Hex width={74} className={`relative right-12 z-0 ${privateKey || isHover ? "bg-cyan-400" : "bg-gray-600"} transition-all flex items-center justify-center`}>
        <Hex width={64.66} className="bg-gray-800 flex items-center justify-center">
          <Hex width={55.42} className={`${privateKey || isHover ? "bg-cyan-500/75" : "bg-white/30"} transition-all flex items-center justify-center`}>
            <Hex width={46.18} className="bg-gray-800 flex items-center justify-center">
            </Hex>
          </Hex>
        </Hex>
      </Hex>
    </div>
  );
};

