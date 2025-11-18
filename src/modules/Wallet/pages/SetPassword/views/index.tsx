import { motion } from "framer-motion";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { PasswordInput } from "../../../../../components";
import { useWalletCreationContext } from "../../../context";
import { PATH } from "../../../../../const";
import { Images } from "../../../../../assets/images";
import { useAuthContext } from "../../../../../context";
import { usePassword } from "../../../../../hooks";

export const SetPasswordView: React.FC = () => {
    const { handleCreateWallet, signupUser, setUser } = useAuthContext();
    const { seedPhrase } = useWalletCreationContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handleBack = () => {
        navigate(PATH.WALLET_CREATION + PATH.SEED_CONFIRM);
    };
    const { pwd, handlePasswordChange, handleConfirmPasswordChange } =
        usePassword();

    const isPasswordValid =
        pwd.password.value === pwd.cPassword.value &&
        pwd.password.value.length > 8;

    return (
        <div className="w-full h-full relative flex flex-col items-center justify-center">
            <motion.div
                className="max-w-[520px] min-w-[520px] overflow-hidden rounded-3xl bg-cyan-500/10 backdrop-blur-sm border border-cyan-400/30 shadow-2xl flex flex-col items-center justify-center gap-6 px-12 py-10"
            >
                <div className="w-full flex relative z-20">
                    <FaArrowLeft
                        className="text-cyan-300/80 border-2 border-cyan-400/30 rounded-full p-1 hover:bg-cyan-500/20 hover:text-cyan-200 hover:-translate-x-1 transition"
                        size={28}
                        onClick={handleBack}
                    />
                </div>
                <div className="text-2xl text-white font-medium text-center flex items-center justify-center gap-2 relative z-20">
                    Set Password for your wallet
                </div>
                <img
                    src={Images.WalletLogo}
                    alt="wallet"
                    className="w-36 relative z-20"
                />
                <div className="w-full flex flex-col gap-4 relative z-20">
                    <PasswordInput
                        label="Password"
                        value={pwd.password.value}
                        error={pwd.password.error}
                        onChange={handlePasswordChange}
                    />
                    <PasswordInput
                        label="Confirm Password"
                        value={pwd.cPassword.value}
                        error={pwd.cPassword.error}
                        onChange={handleConfirmPasswordChange}
                    />
                </div>
                <button
                    onClick={() => {
                        setIsLoading(true);
                        handleCreateWallet(
                            seedPhrase,
                            pwd.password.value,
                        ).then(async (walletData) => {
                            try {
                                const data = await signupUser(walletData.address);
                                setUser({
                                    ...data,
                                });
                            } catch (error) {
                                console.error(error);
                            } finally {
                                setIsLoading(false);
                                navigate(PATH.GAME);
                            }
                        }).catch((error) => {
                            console.error(error);
                            setIsLoading(false);
                        });
                    }}
                    disabled={!isPasswordValid || isLoading}
                    className={`w-full h-14 rounded-2xl font-semibold text-white transition-all duration-300 transform flex items-center justify-center gap-2 ${isPasswordValid
                        ? `bg-gradient-to-r from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 border border-cyan-400/30 ${isLoading ? "cursor-none" : "hover:scale-[1.02] active:scale-[0.98]"}`
                        : "bg-cyan-500/10 text-cyan-300/50 cursor-none border border-cyan-400/20"
                        }`}
                >
                    {isLoading ? (
                        <>
                            <FaSpinner className="animate-spin" />
                            Creating Wallet...
                        </>
                    ) : (
                        "Create Wallet"
                    )}
                </button>
            </motion.div>
        </div>
    );
};
