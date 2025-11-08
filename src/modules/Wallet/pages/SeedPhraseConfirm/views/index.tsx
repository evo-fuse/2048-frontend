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
        className="max-w-[520px] min-w-[520px] overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl flex flex-col items-center justify-center gap-6 px-12 py-10"
      >
        <div className="w-full flex relative z-20">
          <FaArrowLeft
            className="text-gray-300 border-2 border-gray-600 rounded-full p-1 hover:bg-gray-700/50 hover:-translate-x-1 transition"
            size={28}
            onClick={handleBack}
          />
        </div>
        <div className="text-2xl text-gray-100 font-medium text-center flex items-center justify-center gap-2 relative z-20">
          Confirm Secret Recovery Phrase
        </div>
        <img
          src={Images.WalletLogo}
          alt="wallet"
          className="w-56 relative z-20"
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
              className="px-3 py-2 text-gray-100 text-sm rounded-lg text-center bg-gray-800/60 backdrop-blur-sm border border-gray-700/30 font-mono read-only:border-gray-600/50 read-only:bg-gray-700/40"
            />
          ))}
        </div>
        <button
          onClick={() => {
            navigate(PATH.WALLET_CREATION + PATH.SET_PASSWORD);
          }}
          disabled={!isSeedsCorrect}
          className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${isSeedsCorrect
            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
            : "bg-gray-700/50 text-gray-500"
            }`}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
};
