import { FaRegEye, FaRegEyeSlash, FaArrowLeft } from "react-icons/fa";
import { Images } from "../../../../../assets/images";
import { useOpen } from "../../../../../hooks";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";
import { PasswordInput } from "../../../../../components";
import { useAuthContext } from "../../../../../context";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../../const";

export const ImportExistingWalletView: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useOpen();
  const [seed, setSeed] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [pwd, setPwd] = useState({
    password: { value: "", error: "" },
    cPassword: { value: "", error: "" },
  });
  const { handleCreateWallet } = useAuthContext();
  useEffect(() => {
    setIsValid(ethers.Mnemonic.isValidMnemonic(seed.join(" ")));
  }, [seed]);
  const handleBack = () => {
    navigate(PATH.WALLET_CREATION);
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {/* Main glass container */}
      <div className="w-full max-w-2xl backdrop-blur-sm bg-cyan-500/10 border border-cyan-400/30 rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-8">
        <div className="w-full flex relative z-20">
          <FaArrowLeft
            className="text-cyan-300/80 border-2 border-cyan-400/30 rounded-full p-1 hover:bg-cyan-500/20 hover:text-cyan-200 hover:-translate-x-1 transition"
            size={28}
            onClick={handleBack}
          />
        </div>
        {/* Header section */}
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <div className="text-3xl font-bold text-white tracking-tight text-center">
            Access your wallet with your Secret Recovery Phrase
          </div>
          <div className="w-36 h-36 rounded-2xl flex items-center justify-center">
            <img src={Images.WalletLogo} alt="wallet" className="w-36 h-36 object-contain" />
          </div>
        </div>

        {/* Show/Hide toggle */}
        <div
          className="flex items-center justify-end gap-2 text-cyan-300/80 hover:text-cyan-200 transition-colors w-full"
          onClick={onToggle}
        >
          {isOpen ? (
            <>
              <span className="text-sm">Hide</span> <FaRegEyeSlash className="w-4 h-4" />
            </>
          ) : (
            <>
              <span className="text-sm">Show</span> <FaRegEye className="w-4 h-4" />
            </>
          )}
        </div>

        {/* Seed phrase inputs */}
        <div className="w-full grid grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, idx) => (
            <input
              key={idx}
              value={seed[idx]}
              onChange={(e) =>
                setSeed((prev) =>
                  prev.map((value, index) =>
                    index === idx ? e.target.value : value
                  )
                )
              }
              type={isOpen ? "text" : "password"}
              className="px-3 py-2 text-white text-sm rounded-xl text-center bg-cyan-500/10 border border-cyan-400/30 focus:border-cyan-400/60 focus:outline-none transition-all duration-200 placeholder-cyan-300/40"
              placeholder={`${idx + 1}`}
            />
          ))}
        </div>

        {/* Validation messages */}
        {seed.join(" ").trim().split(" ").length < 12 ? (
          <p className="text-cyan-400 font-medium text-sm">Enter Seed Phrase</p>
        ) : (
          !isValid && (
            <p className="text-cyan-400 font-medium text-sm">
              Invalid Seed Phrase
            </p>
          )
        )}

        {/* Password inputs */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col gap-4 overflow-hidden"
            >
              <PasswordInput
                label="Password"
                value={pwd.password.value}
                error={pwd.password.error}
                onChange={(e) => {
                  const curValue = e.target.value;
                  setPwd({
                    ...pwd,
                    password: {
                      value: curValue,
                      error:
                        curValue.length === 0
                          ? ""
                          : curValue.length < 8
                            ? "Password length should be longer than 8."
                            : "",
                    },
                  });
                }}
              />
              <PasswordInput
                label="Confirm Password"
                value={pwd.cPassword.value}
                error={pwd.cPassword.error}
                onChange={(e) => {
                  const curValue = e.target.value;
                  setPwd({
                    ...pwd,
                    cPassword: {
                      value: curValue,
                      error:
                        curValue === pwd.password.value
                          ? ""
                          : "Password doesn't match",
                    },
                  });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm button */}
        <button
          onClick={() => {
            handleCreateWallet(
              seed.join(" "),
              pwd.password.value,
            ).then(() => navigate(PATH.GAME));
          }}
          disabled={
            !isValid ||
            pwd.password.value.length < 8 ||
            pwd.password.value !== pwd.cPassword.value
          }
          className={`w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${!isValid ||
            pwd.password.value.length < 8 ||
            pwd.password.value !== pwd.cPassword.value
            ? "bg-cyan-500/10 text-cyan-300/50 cursor-none border border-cyan-400/20"
            : "bg-gradient-to-r from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 border border-cyan-400/30"
            }`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
