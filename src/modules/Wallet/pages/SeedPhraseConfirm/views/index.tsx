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
  const { handleCreateWallet } = useAuthContext();
  const { seedPhrase } = useWalletCreationContext();
  const { user } = useAuthContext();
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
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <motion.div
        className="max-w-[480px] min-w-[480px] border-2 border-white/20 overflow-hidden min-h-2/3 rounded-lg bg-white/20 backdrop-blur-sm shadow-md shadow-black/60 flex flex-col items-center justify-center gap-4 px-16 py-8"
        animate={{
          minHeight: emptyInputs.every(
            (idx) => checkSeeds[idx] === seedArray[idx]
          )
            ? "auto"
            : "66.666667%",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <img
          src={Images.WalletBg}
          alt="wallet"
          className="w-full h-auto absolute top-0 left-0 z-10 rounded-lg"
        />
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-black/50 backdrop-blur-sm" />
        <div className="w-full flex relative z-20">
          <FaArrowLeft
            className="text-white border-2 border-white rounded-full p-1 hover:bg-white/10 hover:-translate-x-1 transition"
            size={28}
            onClick={handleBack}
          />
        </div>
        <div className="text-4xl text-white font-bold text-center flex items-center justify-center gap-2 relative z-20">
          Confirm Secret Recovery Phrase
        </div>
        <img
          src={Images.WalletLogo}
          alt="wallet"
          className="w-56 relative z-20"
        />
        <div className="w-full grid grid-cols-4 gap-2 relative z-20">
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
              className="px-2 py-1 text-white text-md rounded-md text-center bg-transparent border border-orange-500 read-only:border-white focus:outline-none"
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
              className="w-full flex flex-col gap-2 overflow-hidden relative z-20"
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
              user?.email || ""
            ).then(() => {
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
          className="confirm relative z-20 h-[71px] w-[352px] cursor-none"
        ></button>
      </motion.div>
    </div>
  );
};
