import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
                className="max-w-[520px] min-w-[520px] overflow-hidden rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 shadow-2xl flex flex-col items-center justify-center gap-6 px-12 py-10"
            >
                <div className="w-full flex relative z-20">
                    <FaArrowLeft
                        className="text-gray-300 border-2 border-gray-600 rounded-full p-1 hover:bg-gray-700/50 hover:-translate-x-1 transition"
                        size={28}
                        onClick={handleBack}
                    />
                </div>
                <div className="text-2xl text-gray-100 font-medium text-center flex items-center justify-center gap-2 relative z-20">
                    Set Password for your wallet
                </div>
                <img
                    src={Images.WalletLogo}
                    alt="wallet"
                    className="w-56 relative z-20"
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
                    onClick={() =>
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
                                navigate(PATH.GAME);
                            }
                        })
                    }
                    disabled={!isPasswordValid}
                    className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-200 ${isPasswordValid
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        : "bg-gray-700/50 text-gray-500"
                        }`}
                >
                    Create Wallet
                </button>
            </motion.div>
        </div>
    );
};
