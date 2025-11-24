import { Select } from "../../../../../components";
import { useState, useEffect, useMemo } from "react";
import { TbMoneybag } from "react-icons/tb";
import { HiArrowTrendingDown } from "react-icons/hi2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuthContext } from "../../../../../context";
import Modal from "../../../../../components/Modal";
import { useOpen } from "../../../../../hooks";
import { User } from "../../../../../types";
import { useNavigate } from "react-router-dom";
import { PATH, TOKEN } from "../../../../../const";
import { motion } from "framer-motion";
import { Images } from "../../../../../assets/images";
import { formatAddress } from "../../../../../utils/address";

export const WithdrawView = () => {
    const [network, setNetwork] = useState<string>("Fuse");
    const [token, setToken] = useState<string>("USDT");
    const [amount, setAmount] = useState<string>("0");
    const { handleUpdateUser, user, setUser, handleWithdrawRequest } = useAuthContext();
    const [withdrawAddress, setWithdrawAddress] = useState<string>(user?.address || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { onOpen } = useOpen(false);
    const navigate = useNavigate();

    // Modal state
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<'success' | 'error'>('success');
    const [modalMessage, setModalMessage] = useState<string>("");

    // Pre-fill user's address when user data loads
    useEffect(() => {
        if (user?.address && !withdrawAddress) {
            setWithdrawAddress(user.address);
        }
    }, [user?.address, withdrawAddress]);

    const getUserBalanceKey = (network: string, token: string): keyof User => {
        const networkPrefix = {
            "Fuse": "fuse",
            "Ethereum": "eth",
            "Binance": "bnb",
            "Polygon": "pol"
        }[network] || "fuse";

        const tokenSuffix = token.toLowerCase();
        return (networkPrefix + tokenSuffix) as keyof User;
    };

    // Available balance from backend (deposited balance) for selected token
    const availableBalance = useMemo(() => {
        const balanceKey = getUserBalanceKey(network, token);
        return Number(user?.[balanceKey] || 0);
    }, [network, token, user]);

    // Calculate total available balance summed by token type (USDT and USDC)
    const totalAvailableBalances = useMemo(() => {
        if (!user) return { usdt: 0, usdc: 0 };

        const totalUsdt =
            Number(user.fuseusdt || 0) +
            Number(user.ethusdt || 0) +
            Number(user.bnbusdt || 0) +
            Number(user.polusdt || 0);

        const totalUsdc =
            Number(user.fuseusdc || 0) +
            Number(user.ethusdc || 0) +
            Number(user.bnbusdc || 0) +
            Number(user.polusdc || 0);

        return { usdt: totalUsdt, usdc: totalUsdc };
    }, [user]);

    const handleWithdraw = async () => {
        // Validation

        if (!withdrawAddress) {
            // Toast.error("Invalid Address", "Please enter a valid withdrawal address");
            return;
        }

        // Basic address validation
        if (!withdrawAddress.startsWith("0x") || withdrawAddress.length !== 42) {
            // Toast.error("Invalid Address", "Please enter a valid Ethereum-compatible address");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            onOpen();
            // Toast.error("Invalid Amount", "Please enter a valid amount greater than 0");
            return;
        }

        if (Number(amount) > availableBalance) {
            // Toast.error("Insufficient Balance", `Your available balance is ${availableBalance} ${token}. Please enter a lower amount.`);
            return;
        }

        setIsLoading(true);
        try {
            // Send withdrawal request to backend
            const balanceKey = getUserBalanceKey(network, token);
            const newBalance = availableBalance - Number(amount);

            // Create withdrawal request
            const withdrawalData = {
                network,
                token,
                amount: Number(amount),
                toAddress: withdrawAddress,
            };

            // Call backend API to process withdrawal using AuthContext
            await handleWithdrawRequest(withdrawalData);

            // Update user balance after successful withdrawal
            const data = await handleUpdateUser({
                [balanceKey]: String(newBalance)
            });

            if (data) {
                setUser(data);
                setModalType('success');
                setModalMessage(`Successfully withdraw ${amount} ${token} to ${formatAddress(withdrawAddress)}`);
                setShowModal(true);
            }
        } catch (error: any) {
            console.error("Withdrawal failed:", error);

            // Show error modal
            setModalType('error');
            if (error?.response?.data?.message) {
                setModalMessage(error.response.data.message);
            } else {
                setModalMessage("An error occurred during the withdrawal. Please try again.");
            }
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full text-white flex gap-4">
            <div className="w-full h-full flex flex-col">
                {/* Header with gradient accent */}
                <div className="relative flex-shrink-0 flex items-center justify-start gap-0 w-full border-b border-white/10">
                    <img src={Images.LOGO} alt="logo" className="w-10 h-10" />
                    <h2 className="text-2xl font-bold p-4">
                        Withdraw
                    </h2>
                </div>

                <div className="px-8 flex flex-col gap-4 overflow-y-auto flex-1 py-4">
                    {/* Network & Token Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Choose Network
                            </label>
                            <Select
                                options={TOKEN.networkList}
                                value={network}
                                onChange={(value) => {
                                    setNetwork(value as string);
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Choose Token
                            </label>
                            <Select
                                options={TOKEN.tokenList}
                                value={token}
                                onChange={(value) => {
                                    setToken(value as string);
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Available Balance for Selected Token */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Available Balance ({network} - {token})
                                </label>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                        {availableBalance.toFixed(5)}
                                    </span>
                                    <span className="text-sm text-gray-400">{token}</span>
                                </div>
                                <span className="text-xs text-gray-400">Ready to withdraw</span>
                            </div>
                            <motion.div
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center"
                            >
                                <TbMoneybag className="text-cyan-500" size={24} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Total Available Balances Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="bg-gray-900/50 border border-white/10 rounded-xl p-4"
                    >
                        <h3 className="text-sm font-bold mb-3 text-gray-200">Total Available Balance (All Networks)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Total USDT */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-3"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total USDT</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-green-400">
                                            {totalAvailableBalances.usdt.toFixed(5)}
                                        </span>
                                        <span className="text-xs text-gray-400">USDT</span>
                                    </div>
                                    <span className="text-xs text-gray-500">Across all networks</span>
                                </div>
                            </motion.div>

                            {/* Total USDC */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.35 }}
                                className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-lg p-3"
                            >
                                <div className="flex flex-col gap-0.5">
                                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total USDC</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xl font-bold text-blue-400">
                                            {totalAvailableBalances.usdc.toFixed(5)}
                                        </span>
                                        <span className="text-xs text-gray-400">USDC</span>
                                    </div>
                                    <span className="text-xs text-gray-500">Across all networks</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Withdrawal Address Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-2"
                    >
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Withdrawal Address
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-3 py-2 pr-12 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 transition-all text-sm font-mono"
                                placeholder="0x..."
                                value={withdrawAddress}
                                onChange={(e) => setWithdrawAddress(e.target.value)}
                            />
                        </div>
                    </motion.div>

                    {/* Withdrawal Amount Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                Withdrawal Amount
                            </label>
                            <button
                                onClick={() => setAmount(String(availableBalance))}
                                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                            >
                                MAX
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                className="w-full px-3 py-2 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-base"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(isNaN(parseFloat(e.target.value)) ? amount : e.target.value);
                                }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                                {token}
                            </span>
                        </div>
                        {Number(amount) > availableBalance && (
                            <span className="text-xs text-red-400">
                                Amount exceeds available balance
                            </span>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 cursor-none disabled:opacity-50 disabled:cursor-none group"
                            onClick={handleWithdraw}
                            disabled={isLoading || !withdrawAddress || Number(amount) <= 0 || Number(amount) > availableBalance}
                        >
                            <HiArrowTrendingDown size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-base">{isLoading ? "Processing..." : "Withdraw Now"}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-gray-500/30 cursor-none group border border-white/10"
                            onClick={() => navigate(PATH.GAME + PATH.DEPOSIT)}
                        >
                            <TbMoneybag size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-base">Go to Deposit</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Withdrawal Result Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    if (modalType === 'success') {
                        setAmount("0");
                    }
                }}
                title={modalType === 'success' ? "Withdrawal Successful" : "Withdrawal Failed"}
                maxWidth="max-w-md"
            >
                <div className="flex flex-col items-center gap-4 p-4">
                    <div className={`flex items-center justify-center w-16 h-16 rounded-full ${modalType === 'success'
                        ? 'bg-cyan-500/20'
                        : 'bg-red-500/20'
                        }`}>
                        {modalType === 'success' ? (
                            <FaCheckCircle className="text-cyan-400 text-4xl" />
                        ) : (
                            <FaTimesCircle className="text-red-400 text-4xl" />
                        )}
                    </div>

                    <p className="text-white text-center text-base leading-relaxed">
                        {modalMessage}
                    </p>

                    {modalType === 'success' && (
                        <div className="w-full bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20">
                            <div className="text-sm text-gray-300 space-y-1">
                                <p className="text-cyan-400 font-semibold">Transaction Details:</p>
                                <p><span className="text-gray-400">Network:</span> {network}</p>
                                <p><span className="text-gray-400">Token:</span> {token}</p>
                                <p><span className="text-gray-400">Amount:</span> {amount}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setShowModal(false);
                            if (modalType === 'success') {
                                setAmount("0");
                            }
                        }}
                        className={`w-full font-bold py-3 rounded-md transition-colors cursor-none mt-2 ${modalType === 'success'
                            ? 'bg-cyan-500/80 hover:bg-cyan-400/80 text-white'
                            : 'bg-red-500/80 hover:bg-red-400/80 text-white'
                            }`}
                    >
                        {modalType === 'success' ? 'Close' : 'Try Again'}
                    </button>
                </div>
            </Modal>
        </div>
    );
};