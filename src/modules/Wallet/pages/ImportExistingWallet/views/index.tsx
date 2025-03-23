import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
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
  const { user, handleCreateWallet } = useAuthContext();
  useEffect(() => {
    setIsValid(ethers.Mnemonic.isValidMnemonic(seed.join(" ")));
  }, [seed]);
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <div className="max-w-[480px] min-h-2/3 py-8 rounded bg-white/20 backdrop-blur-sm shadow-md shadow-black/60 flex flex-col items-center justify-center gap-4 px-16">
        <div className="text-3xl text-white font-bold text-center">
          Access your wallet with your Secret Recovery Phrase
        </div>
        <img src={Images.WalletLogo} alt="wallet" className="w-56" />
        <div
          className="flex items-center justify-end gap-2 text-white w-full"
          onClick={onToggle}
        >
          {isOpen ? (
            <>
              Hide <FaRegEyeSlash />
            </>
          ) : (
            <>
              Show <FaRegEye />
            </>
          )}
        </div>
        <div className="w-full grid grid-cols-4 gap-2">
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
              className="px-2 py-1 text-white text-lg rounded-md text-center bg-transparent border border-white focus:outline-none"
            />
          ))}
        </div>
        {seed.join(" ").trim().split(" ").length < 12 ? (
          <p className="text-orange-500 font-bold text-lg">Enter Seed Phrase</p>
        ) : (
          !isValid && (
            <p className="text-orange-500 font-bold text-lg">
              Invalid Seed Phrase
            </p>
          )
        )}
        <AnimatePresence>
          {isValid && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col gap-2 overflow-hidden"
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
        <button
          onClick={() => {
            handleCreateWallet(
              seed.join(" "),
              pwd.password.value,
              user?.email || ""
            ).then(() => navigate(PATH.GAME));
          }}
          disabled={
            !isValid ||
            pwd.password.value.length < 8 ||
            pwd.password.value !== pwd.cPassword.value
          }
          className="bg-orange-500 hover:bg-orange-600 transition text-white font-bold w-full rounded-full py-1 text-2xl disabled:bg-orange-600/50"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
