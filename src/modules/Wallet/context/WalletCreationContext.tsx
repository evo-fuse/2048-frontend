import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

type WalletCreationContextType = {
  seedPhrase: string;
  regenerateSeedPhrase: () => void;
};

export const WalletCreationContext = createContext<
  WalletCreationContextType | undefined
>(undefined);

interface WalletCreationProviderProps {
  children: React.ReactNode;
}

// Proper BIP39 seed phrase generation
const generateBIP39SeedPhrase = (): string => {
  try {
    const wallet = ethers.Wallet.createRandom();
    if (!wallet.mnemonic) {
      throw new Error("Failed to generate mnemonic");
    }
    return wallet.mnemonic.phrase;
  } catch (error) {
    console.error("Error generating seed phrase:", error);
    throw error;
  }
};

export const getWalletFromMnemonic = (mnemonic: string) => {
  try {
    // Create a wallet instance from the mnemonic
    const wallet = ethers.Wallet.fromPhrase(mnemonic);

    // Get the wallet address
    const address = wallet.address;

    return {
      address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    console.error("Error deriving wallet from mnemonic:", error);
    throw error;
  }
};

export const WalletCreationProvider: React.FC<WalletCreationProviderProps> = ({
  children,
}) => {
  const [seedPhrase, setSeedPhrase] = useState(() =>
    generateBIP39SeedPhrase()
  );
  

  const regenerateSeedPhrase = () => {
    setSeedPhrase(generateBIP39SeedPhrase());
  };

  const value = { seedPhrase, regenerateSeedPhrase };

  return (
    <WalletCreationContext.Provider value={value}>
      {children}
    </WalletCreationContext.Provider>
  );
};

export const useWalletCreationContext = () => {
  const context = useContext(WalletCreationContext);
  if (!context) {
    throw new Error(
      "useWalletCreactionContext must be used within a WalletCreationProvider"
    );
  }
  return context;
};
