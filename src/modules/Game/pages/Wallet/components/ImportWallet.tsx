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
    email: string
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
      user?.email || ""
    ).then(() => {
      if (!user) return;
      setUser({ ...user, walletAddress });
      onClose();
    });
  };
  return (
    <div className="w-full px-4 pb-4 flex flex-col gap-4">
      <div className="flex justify-end">
        <div
          onClick={show ? showClose : showOpen}
          className="text-white text-sm bg-transparent px-3 py-1 rounded-md transition-colors"
        >
          {show ? (
            <div className="flex items-center gap-2">
              <HiOutlineEyeSlash size={24} />
              Hide Phrase
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <HiOutlineEye size={24} />
              Show Phrase
            </div>
          )}
        </div>
      </div>
      <div className="w-full grid grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div className="flex items-center gap-2 text-white">
            {index + 1}.
            <input
              key={`seed-${index}`}
              type={show ? "text" : "password"}
              value={seedPhrase[index]}
              onChange={(e) =>
                setSeedPhrase(
                  seedPhrase.map((_, i) => (i === index ? e.target.value : _))
                )
              }
              className="w-full h-10 rounded-md bg-transparent px-3 border border-white/10 py-1 text-white focus:outline-none"
            />
          </div>
        ))}
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <PasswordInput
        placeholder="New Password"
        className="w-full h-10 rounded-md bg-transparent px-3 border border-white/10 py-1 text-white focus:outline-none text-sm font-bold"
        value={pwd.password.value}
        onChange={handlePasswordChange}
        error={pwd.password.error}
      />
      <PasswordInput
        placeholder="Confirm Password"
        className="w-full h-10 rounded-md bg-transparent px-3 border border-white/10 py-1 text-white focus:outline-none text-sm font-bold"
        value={pwd.cPassword.value}
        onChange={handleConfirmPasswordChange}
        error={pwd.cPassword.error}
      />
      <button
        className="w-full h-10 rounded-md bg-gray-600/60 px-3 py-1 text-white focus:outline-none disabled:opacity-50 disabled:hover:bg-gray-600/60 hover:bg-gray-600/80 transition-colors cursor-none"
        disabled={
          !isValid ||
          pwd.password.value !== pwd.cPassword.value ||
          pwd.password.value.length < 8
        }
        onClick={handleImport}
      >
        Import
      </button>
    </div>
  );
};
