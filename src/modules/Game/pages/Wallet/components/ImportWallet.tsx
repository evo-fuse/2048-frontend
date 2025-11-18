import { HiOutlineEye } from "react-icons/hi2";

import { usePassword } from "../../../../../hooks";

import { useMemo } from "react";

import { ethers } from "ethers";
import { User } from "../../../../../types";
import { useState } from "react";
import { useOpen } from "../../../../../hooks";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { PasswordInput } from "../../../../../components";

interface ImportWalletProps {
  handleCreateWallet: (
    encData: string,
    password: string,
  ) => Promise<void>;
  user: User | null;
  setUser: (user: User | null) => void;
  onClose: () => void;
}
export const ImportWallet: React.FC<ImportWalletProps> = ({
  handleCreateWallet,
  user,
  setUser,
  onClose,
}) => {
  const { isOpen: show, onOpen: showOpen, onClose: showClose } = useOpen();
  const [seedPhrase, setSeedPhrase] = useState<string[]>(
    Array.from({ length: 12 }).map(() => "")
  );
  const [error, setError] = useState("");
  const walletAddress = useMemo(() => {
    try {
      return ethers.Wallet.fromPhrase(seedPhrase.join(" ")).address;
    } catch (err) {
      if (seedPhrase.join(" ").trim().split(" ").length === 12) {
        setError("Invalid seed phrase");
        return "";
      }
      return "";
    }
  }, [seedPhrase]);
  const { pwd, handlePasswordChange, handleConfirmPasswordChange } =
    usePassword();
  const isValid: boolean = useMemo(
    () => ethers.Mnemonic.isValidMnemonic(seedPhrase.join(" ")),
    [seedPhrase]
  );
  const handleImport = () => {
    handleCreateWallet(
      seedPhrase.join(" "),
      pwd.password.value,
    ).then(() => {
      if (!user) return;
      setUser({ ...user, address: walletAddress });
      onClose();
    });
  };
  const isImportDisabled =
    !isValid ||
    pwd.password.value !== pwd.cPassword.value ||
    pwd.password.value.length < 8;
  return (
    <div className="w-full px-4 pb-4">
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={show ? showClose : showOpen}
            className="flex items-center gap-2 text-cyan-300/80 hover:text-cyan-200 transition-colors text-sm font-medium"
          >
            {show ? (
              <>
                <HiOutlineEyeSlash size={18} />
                Hide Phrase
              </>
            ) : (
              <>
                <HiOutlineEye size={18} />
                Show Phrase
              </>
            )}
          </button>
        </div>

        <div className="w-full grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={`seed-wrapper-${index}`}
              className="flex items-center gap-2 text-cyan-200 text-sm font-semibold"
            >
              <span className="text-cyan-300/70 min-w-6 text-right">{index + 1}.</span>
              <input
                type={show ? "text" : "password"}
                value={seedPhrase[index]}
                onChange={(e) =>
                  setSeedPhrase(
                    seedPhrase.map((word, i) =>
                      i === index ? e.target.value : word
                    )
                  )
                }
                className="w-full h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/30 px-3 text-white placeholder-cyan-300/40 focus:border-cyan-400/60 focus:bg-cyan-500/15 transition-all duration-200"
                placeholder="word"
              />
            </div>
          ))}
        </div>

        <div className="text-cyan-300/70 text-sm text-center">
          Enter the 12-word recovery phrase in order. You can temporarily{" "}
          {show ? "hide" : "show"} the words for privacy.
        </div>

        {error && (
          <div className="text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <PasswordInput
            label="New Password"
            placeholder="Create a password"
            value={pwd.password.value}
            onChange={handlePasswordChange}
            error={pwd.password.error}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={pwd.cPassword.value}
            onChange={handleConfirmPasswordChange}
            error={pwd.cPassword.error}
          />
        </div>

        <button
          className={`w-full h-12 rounded-2xl font-semibold text-white transition-all duration-300 transform ${isImportDisabled
            ? "bg-cyan-500/10 text-cyan-300/50 cursor-none border border-cyan-400/20"
            : "bg-gradient-to-r from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 border border-cyan-400/30 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          disabled={isImportDisabled}
          onClick={handleImport}
        >
          Import Wallet
        </button>
      </div>
    </div>
  );
};
