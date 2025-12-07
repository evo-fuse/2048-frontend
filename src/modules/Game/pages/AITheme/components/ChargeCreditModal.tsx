import { useState } from "react";
import Modal from "../../../../../components/Modal";
import { TokenBalanceSection } from "../../../components";
import { FaSpinner } from "react-icons/fa";
import { useAuthContext } from "../../../../../context";
import { useWeb3Context } from "../../../../../context/Web3Context";
import { CONFIG } from "../../../../../const";
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { AiOutlineSwap } from "react-icons/ai";

interface ChargeCreditModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ChargeCreditModal: React.FC<ChargeCreditModalProps> = ({ isOpen, onClose }) => {
    const [selectedToken, setSelectedToken] = useState<string>("busdt");
    const [payAmount, setPayAmount] = useState<string>("");
    const [creditAmount, setCreditAmount] = useState<string>("");
    const [balances, setBalances] = useState<Record<string, string>>({});
    const [isLoadingBalances, setIsLoadingBalances] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const creditPrice = 0.05; // 1 Credit = 0.05 tokens

    const { user, handleUpdateUser, setUser } = useAuthContext();
    const { buyThemesWithUSD } = useWeb3Context();

    const handleTokenSelect = (tokenType: string) => {
        setSelectedToken(tokenType);
    };

    const handlePayAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setPayAmount(value);
            // Calculate credit amount based on pay amount
            if (value === "") {
                setCreditAmount("");
            } else {
                const credits = Math.floor(Number(value) / creditPrice);
                setCreditAmount(credits.toString());
            }
        }
    };

    const handleCreditAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setCreditAmount(value);
            // Calculate pay amount based on credit amount
            if (value === "") {
                setPayAmount("");
            } else {
                const amount = (Number(value) * creditPrice).toFixed(2);
                setPayAmount(amount);
            }
        }
    };

    const handleBalanceChange = (
        newBalances: Record<string, string>,
        isLoading: boolean
    ) => {
        setBalances(newBalances);
        setIsLoadingBalances(isLoading);
    };

    const calculatedCredits = creditAmount ? Number(creditAmount) : (payAmount ? Math.floor(Number(payAmount) / creditPrice) : 0);
    const hasInsufficientBalance =
        Number(balances[selectedToken] || 0) < Number(payAmount || 0);
    const isValidAmount = payAmount && Number(payAmount) > 0;

    const handlePurchase = async () => {
        if (!user || !payAmount || Number(payAmount) <= 0) return;

        setIsLoading(true);
        try {
            // Process payment transaction
            await buyThemesWithUSD(
                selectedToken,
                Number(payAmount) * 100, // Convert to cents (multiply by 100)
                CONFIG.RECEIVER_ADDRESS
            );

            // Calculate new credit amount
            const creditsToAdd = calculatedCredits;
            const newCredits = (user.ATCredits || 0) + creditsToAdd;

            // Update user credits on backend
            const data = await handleUpdateUser({
                ...user,
                ATCredits: newCredits,
            });

            // Refresh user data from backend
            setUser(data);

            // Close modal and reset form
            setPayAmount("");
            setCreditAmount("");
            onClose();
        } catch (error) {
            console.error("Purchase failed:", error);
            // You might want to show an error notification here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Charge Credit"
            maxWidth="max-w-md"
        >
            <div className="flex flex-col gap-4 p-4">
                {/* Pay Amount and Credit Balance Rate Section */}
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-11 gap-3">
                        <div className="flex items-center gap-2 col-span-5">
                            <GiMoneyStack size={20} />
                            <span className="text-white font-bold text-sm">Pay Amount</span>
                        </div>
                        <div className=""></div>
                        <div className="flex items-center gap-2 col-span-5">
                            <GrMoney size={20} />
                            <span className="text-white font-bold text-sm">Credit Balance</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-3">
                        <div className="flex flex-col col-span-5 gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={payAmount}
                                    onChange={handlePayAmountChange}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-center col-span-1">
                            <AiOutlineSwap />
                        </div>
                        <div className="flex flex-col col-span-5 gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={creditAmount}
                                    onChange={handleCreditAmountChange}
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-base"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-cyan-900/40 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-cyan-200 text-sm">Credit Balance Rate:</span>
                            <span className="text-white font-bold text-sm">1 $ = {1 / creditPrice} Credits</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-cyan-700/50">
                            <span className="text-white font-bold text-sm">You will receive:</span>
                            <span className="text-cyan-400 font-bold text-lg">{calculatedCredits} Credits</span>
                        </div>
                    </div>
                </div>

                {/* Token Balance Section */}
                <TokenBalanceSection
                    selectedToken={selectedToken}
                    onTokenSelect={handleTokenSelect}
                    requiredAmount={payAmount ? Number(payAmount) : 0}
                    onBalanceChange={handleBalanceChange}
                />

                <div className="flex justify-between items-center bg-cyan-900/40 p-3 rounded-md mt-2">
                    <span className="text-white font-bold text-sm">Total:</span>
                    <span className="text-white font-bold text-sm">{payAmount || "0.00"}$</span>
                </div>

                <button
                    className="w-full bg-cyan-500/30 hover:bg-cyan-500/40 text-white font-bold py-3 rounded-md transition-colors disabled:bg-cyan-900/50 disabled:opacity-50 cursor-none text-sm"
                    onClick={handlePurchase}
                    disabled={
                        isLoading ||
                        isLoadingBalances ||
                        !isValidAmount ||
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
        </Modal >
    );
};