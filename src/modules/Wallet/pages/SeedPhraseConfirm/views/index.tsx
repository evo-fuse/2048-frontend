import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWalletCreationContext } from "../../../context";
import { PATH } from "../../../../../const";
import { Images } from "../../../../../assets/images";

export const SeedPhraseConfirmView: React.FC = () => {
  const { seedPhrase } = useWalletCreationContext();
  const seedArray = useMemo(() => seedPhrase.split(" "), []);
  const navigate = useNavigate();
  const [checkSeeds, setCheckSeeds] = useState<Record<number, string>>({});
  const emptyInputs = useMemo(() => {
    const randomNumbers: number[] = [];
    while (randomNumbers.length < 3) {
      const num = Math.floor(Math.random() * 12);
      if (!randomNumbers.includes(num)) {
        randomNumbers.push(num);
      }
    }
    return randomNumbers;
  }, []);
  const handleBack = () => {
    navigate(PATH.WALLET_CREATION + PATH.SEED_CREATION);
  };

  const isSeedsCorrect = emptyInputs.every(
    (idx) => checkSeeds[idx] === seedArray[idx]
  );

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <motion.div
        className="max-w-[520px] min-w-[520px] overflow-hidden rounded-3xl bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 shadow-2xl flex flex-col items-center justify-center gap-6 px-12 py-10"
      >
        <div className="w-full flex relative z-20">
          <FaArrowLeft
            className="text-cyan-300/80 border-2 border-cyan-400/30 rounded-full p-1 hover:bg-cyan-500/20 hover:text-cyan-200 hover:-translate-x-1 transition"
            size={28}
            onClick={handleBack}
          />
        </div>
        <div className="text-2xl text-white font-medium text-center flex items-center justify-center gap-2 relative z-20">
          Confirm Secret Recovery Phrase
        </div>
        <img
          src={Images.WalletLogo}
          alt="wallet"
          className="w-36 relative z-20"
        />
        <div className="w-full grid grid-cols-4 gap-3 relative z-20">
          {seedArray.map((seed, idx) => (
            <input
              type="text"
              value={emptyInputs.includes(idx) ? checkSeeds[idx] || "" : seed}
              key={idx}
              name={`${idx}`}
              readOnly={!emptyInputs.includes(idx)}
              onChange={(e) => {
                setCheckSeeds({
                  ...checkSeeds,
                  [idx]: e.target.value,
                });
              }}
              className="px-3 py-2 text-white text-sm rounded-xl text-center bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 font-mono read-only:border-cyan-400/20 read-only:bg-cyan-500/5 focus:border-cyan-400/60 focus:outline-none transition-all duration-200"
            />
          ))}
        </div>
        <button
          onClick={() => {
            navigate(PATH.WALLET_CREATION + PATH.SET_PASSWORD);
          }}
          disabled={!isSeedsCorrect}
          className={`w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${isSeedsCorrect
            ? "bg-gradient-to-r from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 border border-cyan-400/30"
            : "bg-cyan-500/10 text-cyan-300/50 cursor-none border border-cyan-400/20"
            }`}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};
