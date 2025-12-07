import React, { useState } from "react";
import Modal from "../../../../../components/Modal";
import { Theme } from "../../../../../types";
import { FaSpinner } from "react-icons/fa";
import { TokenBalanceSection } from "../../../components";
import { ThemeInfoSection } from "./ThemeInfoSection";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onPurchase: (tokenType: string) => Promise<void>;
  isLoading: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  theme,
  onPurchase,
  isLoading,
}) => {
  const [selectedToken, setSelectedToken] = useState<string>("busdt");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const handleTokenSelect = (tokenType: string) => {
    setSelectedToken(tokenType);
  };

  const handlePurchase = async () => {
    await onPurchase(selectedToken);
  };

  const handleBalanceChange = (
    newBalances: Record<string, string>,
    isLoading: boolean
  ) => {
    setBalances(newBalances);
    setIsLoadingBalances(isLoading);
  };

  const hasInsufficientBalance =
    Number(balances[selectedToken] || 0) < Number(theme?.price || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Checkout"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 p-4">
        {/* Theme Info Display Section */}
        <ThemeInfoSection theme={theme} />

        {/* Token Balance Section */}
        <TokenBalanceSection
          selectedToken={selectedToken}
          onTokenSelect={handleTokenSelect}
          requiredAmount={theme?.price || 0}
          onBalanceChange={handleBalanceChange}
        />

        <div className="flex justify-between items-center bg-cyan-900/40 p-3 rounded-md mt-2">
          <span className="text-white font-bold text-sm">Total:</span>
          <span className="text-white font-bold text-sm">{theme?.price || 0}$</span>
        </div>

        <button
          className="w-full bg-cyan-500/30 hover:bg-cyan-500/40 text-white font-bold py-3 rounded-md transition-colors disabled:bg-cyan-900/50 disabled:opacity-50 cursor-none text-sm"
          onClick={handlePurchase}
          disabled={
            isLoading ||
            isLoadingBalances ||
            !theme ||
            hasInsufficientBalance
          }
        >
          {isLoading ? (
            <div className="w-full flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              Processing Payment...
            </div>
          ) : (
            "Confirm Purchase"
          )}
        </button>
      </div>
    </Modal>
  );
};
