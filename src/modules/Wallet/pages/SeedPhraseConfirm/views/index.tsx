import { AnimatePresence, motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PasswordInput } from "../../../../../components";
import { useWalletCreationContext } from "../../../context";
import { PATH } from "../../../../../const";
import { Images } from "../../../../../assets/images";
import { useAuthContext } from "../../../../../context";
import { usePassword } from "../../../../../hooks";

export const SeedPhraseConfirmView: React.FC = () => {
  const { handleCreateWallet, signupUser, setUser } = useAuthContext();
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
  const { pwd, handlePasswordChange, handleConfirmPasswordChange } =
    usePassword();

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        className="max-w-[520px] min-w-[520px] overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl flex flex-col items-center justify-center gap-6 px-12 py-10"
        animate={{
          minHeight: emptyInputs.every(
            (idx) => checkSeeds[idx] === seedArray[idx]
          )
            ? "auto"
            : "66.666667%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
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
        <AnimatePresence>
          {emptyInputs.every((idx) => checkSeeds[idx] === seedArray[idx]) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col gap-4 overflow-hidden relative z-20"
            >
              <PasswordInput
                label="Password"
                value={pwd.password.value}
                error={pwd.password.error}
                onChange={handlePasswordChange}
              />
              <PasswordInput
                label="Confirm Password"
                value={pwd.cPassword.value}
                error={pwd.cPassword.error}
                onChange={handleConfirmPasswordChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() =>
            handleCreateWallet(
              seedPhrase,
              pwd.password.value,
            ).then(async (walletData) => {
              const data = await signupUser(walletData.address);
              setUser({
                ...data,
              });
              navigate(PATH.GAME);
            })
          }
          disabled={
            !emptyInputs.every(
              (idx) =>
                checkSeeds[idx] === seedArray[idx] &&
                pwd.password.value === pwd.cPassword.value &&
                pwd.password.value.length > 8
            )
          }
          className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
            emptyInputs.every(
              (idx) =>
                checkSeeds[idx] === seedArray[idx] &&
                pwd.password.value === pwd.cPassword.value &&
                pwd.password.value.length > 8
            )
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
              : "bg-gray-700/50 text-gray-500"
          }`}
        >
          Create Wallet
        </button>
      </motion.div>
    </div>
  );
};
