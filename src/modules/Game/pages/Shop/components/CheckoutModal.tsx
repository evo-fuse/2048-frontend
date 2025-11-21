import React, { useState, useEffect } from "react";
import Modal from "../../../../../components/Modal";
import { Theme, TToken } from "../../../../../types";
import { FaSpinner } from "react-icons/fa";
import { TOKEN } from "../../../../../const";
import { useAuthContext } from "../../../../../context/AuthContext";

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
  const { user } = useAuthContext();
  const [selectedToken, setSelectedToken] = useState<string>("busdt");
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  const supportedTokens = [
    { type: "busdt", name: "USDT (BNB)", icon: TOKEN.BUSDT.icon },
    { type: "busdc", name: "USDC (BNB)", icon: TOKEN.BUSDC.icon },
    { type: "ausdt", name: "USDT (ARB)", icon: TOKEN.AUSDT.icon },
    { type: "ausdc", name: "USDC (ARB)", icon: TOKEN.AUSDC.icon },
    { type: "pusdt", name: "USDT (POL)", icon: TOKEN.PUSDT.icon },
    { type: "pusdc", name: "USDC (POL)", icon: TOKEN.PUSDC.icon },
  ];

  useEffect(() => {
    const fetchBalances = async () => {
      if (!user?.address) return;

      setIsLoadingBalances(true);
      const newBalances: Record<string, string> = {};

      try {
        // Fetch balances for each token
        for (const token of supportedTokens) {
          const tokenType = token.type.toUpperCase();
          const tokenObj = TOKEN[tokenType as keyof typeof TOKEN] as TToken;
          if (tokenObj && tokenObj.balance) {
            const balance = await tokenObj.balance(user.address);
            newBalances[token.type] = balance;
          }
        }

        setBalances(newBalances);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoadingBalances(false);
      }
    };

    if (isOpen) {
      fetchBalances();
    }
  }, [isOpen, user?.address]);

  const handleTokenSelect = (tokenType: string) => {
    setSelectedToken(tokenType);
  };

  const handlePurchase = async () => {
    await onPurchase(selectedToken);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Checkout"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4 bg-cyan-900/40 p-4 rounded-lg">
          <div className="min-w-[80px] h-[80px] bg-transparent rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={theme[2].sm}
              alt={theme.title}
              className="w-20 object-cover"
              draggable="false"
            />
          </div>
          <div>
            <h3 className="text-white text-base font-bold">{theme.title}</h3>
            <p className="text-white font-bold mt-2 text-sm">Price: {theme.price}$</p>
          </div>
        </div>

        <div className="mt-2">
          <h4 className="text-white font-bold mb-2 text-sm">Select Payment Method</h4>
          <div className="grid grid-cols-2 gap-2">
            {supportedTokens.map((token) => (
              <div
                key={token.type}
                className={`flex items-center gap-6 p-3 rounded-lg border cursor-none transition-all ${selectedToken === token.type
                  ? "border-cyan-500 bg-cyan-500/20"
                  : "border-cyan-500/20 hover:border-cyan-400/50"
                  }`}
                onClick={() => handleTokenSelect(token.type)}
              >
                <div className="flex-shrink-0">{token.icon}</div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-medium">
                    {token.name}
                  </span>
                  <span className="text-cyan-200 text-xs">
                    {isLoadingBalances ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      `Balance: ${balances[token.type] || "0.00"}`
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {Number(balances[selectedToken]) < Number(theme?.price || 0) && (
          <span className="text-red-500 text-sm text-center">
            Not enough balance
          </span>
        )}
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
            Number(balances[selectedToken]) < Number(theme?.price || 0)
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
