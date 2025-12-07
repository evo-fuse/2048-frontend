import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { TOKEN } from "../../../const";
import { TToken } from "../../../types";
import { useAuthContext } from "../../../context";

interface TokenBalanceSectionProps {
    selectedToken: string;
    onTokenSelect: (tokenType: string) => void;
    requiredAmount?: number;
    showValidation?: boolean;
    onBalanceChange?: (balances: Record<string, string>, isLoading: boolean) => void;
}

export const TokenBalanceSection: React.FC<TokenBalanceSectionProps> = ({
    selectedToken,
    onTokenSelect,
    requiredAmount = 0,
    showValidation = true,
    onBalanceChange,
}) => {
    const { user } = useAuthContext();
    const [balances, setBalances] = useState<Record<string, string>>({});
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);

    const supportedTokens = [
        { type: "busdt", name: "USDT (BNB)", icon: TOKEN.BUSDT.icon },
        { type: "busdc", name: "USDC (BNB)", icon: TOKEN.BUSDC.icon },
        { type: "eusdt", name: "USDT (ETH)", icon: TOKEN.EUSDT.icon },
        { type: "eusdc", name: "USDC (ETH)", icon: TOKEN.EUSDC.icon },
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

        fetchBalances();
    }, [user?.address]);

    useEffect(() => {
        onBalanceChange?.(balances, isLoadingBalances);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [balances, isLoadingBalances]);

    const hasInsufficientBalance =
        showValidation &&
        Number(balances[selectedToken]) < Number(requiredAmount);

    return (
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
                        onClick={() => onTokenSelect(token.type)}
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
            {hasInsufficientBalance && (
                <span className="text-red-500 text-sm text-center block mt-2">
                    Not enough balance
                </span>
            )}
        </div>
    );
};

