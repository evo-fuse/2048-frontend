import { Select } from "../../../../../components";
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
import { Images } from "../../../../../assets/images";

export const MIN_DEPOSIT_AMOUNT = 5;

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
            return;
        }

        if (!amount || Number(amount) <= 0) {
            onOpen();
            return;
        }

        if (Number(amount) < MIN_DEPOSIT_AMOUNT) {
            onOpen();
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
                title="Deposit"
            >
                <div className="w-full px-4 pb-4 flex flex-col gap-4">
                    <p>{privateKey ? "Please enter the amount to deposit" : "Please connect your wallet to deposit."}</p>
                </div>
            </Modal>
            <div className="w-full h-full flex flex-col">
                {/* Header with gradient accent */}
                <div className="relative flex-shrink-0 flex items-center justify-start gap-0 w-full border-b border-white/10">
                    <img src={Images.LOGO} alt="logo" className="w-10 h-10" />
                    <h2 className="text-2xl font-bold p-4">
                        Deposit
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

                    {/* Balance Display Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    Current Deposit Balance
                                </label>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                                        {user?.[getUserBalanceKey(network, token)] || 0}
                                    </span>
                                    <span className="text-sm text-gray-400">{token}</span>
                                </div>
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

                    {/* Deposit Amount Input */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-2"
                    >
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Deposit Amount
                        </label>
                        <div className="relative">
                            <input
                                className="w-full px-3 py-2 rounded-lg bg-cyan-950/30 border border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-base"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(isNaN(Number(e.target.value)) ? amount : e.target.value);
                                }}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium">
                                {token}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 italic">
                            Minimum deposit: ${MIN_DEPOSIT_AMOUNT}
                        </p>
                        {amount && Number(amount) > 0 && Number(amount) < MIN_DEPOSIT_AMOUNT && (
                            <p className="text-red-400 text-xs">
                                Amount must be greater than or equal to ${MIN_DEPOSIT_AMOUNT}
                            </p>
                        )}
                    </motion.div>

                    {/* Deposit Address */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col gap-2"
                    >
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Deposit Address
                        </label>
                        <div className="bg-cyan-950/30 border border-cyan-400/30 rounded-lg p-3">
                            <code className="text-sm text-cyan-400 break-all font-mono">
                                {DEPOSIT_ADDRESS}
                            </code>
                        </div>
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
                            onClick={handleDeposit}
                            disabled={isLoading}
                        >
                            <TbMoneybag size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-base">{isLoading ? "Processing..." : "Deposit"}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-gray-500/30 cursor-none group border border-white/10"
                            onClick={() => navigate(PATH.GAME + PATH.BETTING)}
                        >
                            <LuDices size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="text-base">Go to Play</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};