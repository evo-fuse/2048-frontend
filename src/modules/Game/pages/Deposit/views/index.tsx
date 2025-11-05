import { Select, Toast } from "../../../../../components";
import { useState } from "react";
import { TbMoneybag } from "react-icons/tb";
import { LuDices } from "react-icons/lu";
import { useAuthContext, useWeb3Context } from "../../../../../context";
import Modal from "../../../../../components/Modal";
import { useOpen } from "../../../../../hooks";
import { User } from "../../../../../types";
import { useNavigate } from "react-router-dom";
import { PATH, TOKEN } from "../../../../../const";
import { motion } from "framer-motion";

export const DepositView = () => {
    const [network, setNetwork] = useState<string>("Fuse");
    const [token, setToken] = useState<string>("USDT");
    const [amount, setAmount] = useState<string>("0");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { privateKey, handleUpdateUser, user, setUser } = useAuthContext();
    const { transferTokens } = useWeb3Context();
    const { isOpen, onOpen, onClose } = useOpen(false);
    const navigate = useNavigate();

    const DEPOSIT_ADDRESS = "0x690AFf6add41987dFA4270EC54C52496f6b5C7DF";

    const getTokenType = (network: string, token: string): string => {
        const networkPrefix = {
            "Fuse": "f",
            "Ethereum": "e",
            "Binance": "b",
            "Polygon": "p"
        }[network] || "";

        const tokenSuffix = token.toLowerCase();
        return networkPrefix + tokenSuffix;
    };

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

    const handleDeposit = async () => {
        // Validation
        if (!privateKey) {
            onOpen();
            Toast.error("Wallet Not Connected", "Please connect your wallet to deposit crypto");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            onOpen();
            Toast.error("Invalid Amount", "Please enter a valid amount greater than 0");
            return;
        }

        setIsLoading(true);
        try {
            const tokenType = getTokenType(network, token);
            await transferTokens(
                tokenType,
                Number(amount) * 100,
                DEPOSIT_ADDRESS,
                {
                    divideBy: 100,
                    gasLimit: 100000,
                    successMessage: `Successfully deposited ${amount} ${token} to your account on ${network} network!`
                }
            );
            // Reset amount after successful deposit
            setAmount("0");
            const balanceKey = getUserBalanceKey(network, token);
            const currentBalance = Number(user?.[balanceKey] || 0);
            const data = await handleUpdateUser({ [balanceKey]: String(currentBalance + Number(amount)) });
            if (data) {
                setUser(data);
            }
        } catch (error: any) {
            console.error("Deposit failed:", error);
            // Only show error toast if transferTokens didn't already show one
            if (!error?.message?.includes("not supported") && !error?.message?.includes("insufficient funds")) {
                Toast.error("Deposit Failed", "An error occurred during the deposit. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full h-full text-white flex gap-4">
            <Modal
                closeOnOutsideClick={true}
                showCloseButton={true}
                isOpen={isOpen}
                onClose={onClose}
                title="Deposit Crypto"
            >
                <div className="w-full px-4 pb-4 flex flex-col gap-4">
                    <p>{privateKey ? "Please enter the amount to deposit" : "Please connect your wallet to deposit crypto"}</p>
                </div>
            </Modal>
            <div className="w-full h-full flex flex-col gap-6">
                {/* Header with gradient accent */}
                <div className="relative">
                    <h2 className="text-2xl font-bold py-6 px-8 border-b border-white/10">
                        Deposit Crypto
                    </h2>
                </div>

                <div className="px-8 flex flex-col gap-6 h-full">
                    {/* Network & Token Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
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
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
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

                    {/* Balance Display Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                                    Current Deposit Balance
                                </label>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                        {user?.[getUserBalanceKey(network, token)] || 0}
                                    </span>
                                    <span className="text-xl text-gray-400">{token}</span>
                                </div>
                            </div>
                            <motion.div
                                initial={{ rotate: -180, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center"
                            >
                                <TbMoneybag className="text-cyan-500" size={32} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Deposit Amount Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-3"
                    >
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Deposit Amount
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-lg"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(isNaN(Number(e.target.value)) ? amount : e.target.value);
                                }}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                                {token}
                            </span>
                        </div>
                    </motion.div>

                    {/* Deposit Address */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col gap-3"
                    >
                        <label className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Deposit Address
                        </label>
                        <div className="bg-gray-800/60 border border-gray-600 rounded-lg p-4">
                            <code className="text-sm text-cyan-400 break-all font-mono">
                                {DEPOSIT_ADDRESS}
                            </code>
                        </div>
                    </motion.div>

                    <div className="flex-1" />

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 cursor-none disabled:opacity-50 disabled:cursor-not-allowed group"
                            onClick={handleDeposit}
                            disabled={isLoading}
                        >
                            <TbMoneybag size={24} className="group-hover:scale-110 transition-transform" />
                            <span className="text-lg">{isLoading ? "Processing..." : "Deposit Now"}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-gray-500/30 cursor-none group border border-white/10"
                            onClick={() => navigate(PATH.GAME + PATH.BETTING)}
                        >
                            <LuDices size={24} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-lg">Go to Play</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};