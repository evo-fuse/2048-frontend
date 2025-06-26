import {
  IoDocumentTextOutline,
  IoStorefrontOutline,
  IoWalletOutline,
  IoColorPaletteOutline,
  IoGameControllerOutline,
} from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { IconType } from "react-icons";
import { PATH } from "../../../const";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context";
import { useGameContext } from "../context/GameContext";
import Metamask from "../../../assets/images/token/metamask.svg";
import { motion } from "framer-motion";

const navItems = [
  {
    Icon: IoGameControllerOutline,
    label: "Game",
    path: PATH.GAME,
  },
  {
    Icon: IoDocumentTextOutline,
    label: "Profile",
    path: `${PATH.GAME}${PATH.PROFILE}`,
  },
  {
    Icon: IoWalletOutline,
    label: "Wallet",
    path: `${PATH.GAME}${PATH.WALLET}`,
  },
  {
    Icon: IoStorefrontOutline,
    label: "Shop",
    path: `${PATH.GAME}${PATH.SHOP}`,
  },
  {
    Icon: IoColorPaletteOutline,
    label: "Theme",
    path: `${PATH.GAME}${PATH.THEME}`,
  },
  {
    Icon: VscSignOut,
    label: "Sign Out",
    path: `${PATH.GAME}${PATH.SIGN_OUT}`,
  },
];

interface NavbarItemProps {
  Icon: IconType;
  label: string;
  checked: boolean;
  navigate: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  Icon,
  label,
  checked,
  navigate,
}) => {
  return (
    <motion.div
      className={`w-full flex items-center justify-start gap-4 px-16 py-2 rounded-r-full overflow-x-auto`}
      onClick={navigate}
      initial={{
        scale: 0.95,
        background: "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0))",
      }}
      animate={{
        background: checked
          ? "linear-gradient(to left, rgba(204,204,204,1), rgba(204,204,204,0))"
          : "linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,0))",
      }}
      whileHover={{
        background: checked
          ? "linear-gradient(to left, rgba(204,204,204,1), rgba(204,204,204,0))"
          : "linear-gradient(to left, rgba(204,204,204,0.5), rgba(204,204,204,0))",
        scale: 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: checked ? 1 : 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon size={24} className="text-white" />
      </motion.div>
      <motion.span
        className="text-white text-xl font-bold"
        initial={{ scale: 1 }}
        whileHover={{ scale: checked ? 1 : 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export const Navbar: React.FC = () => {
  const { privateKey, handleDisconnectWallet } = useAuthContext();
  const { onOpenWalletConnect } = useGameContext();
  const navigate = useNavigate();

  const handleNavigation = (path: string, label: string) => {
    if (label === "Sign Out") {
      localStorage.removeItem("token");
      navigate(PATH.HOME);
    } else {
      navigate(path);
    }
  };

  return (
    <div className="max-w-72 w-full flex flex-col items-center justify-start py-8 gap-4">
      <div className="flex flex-col w-full gap-8">
        <div className="w-full flex items-center justify-between px-8 py-2">
          <button
            onClick={privateKey ? handleDisconnectWallet : onOpenWalletConnect}
            className={`text-white ${
              privateKey
                ? "bg-[#FB923C] hover:bg-[#FB923C]/80"
                : "bg-[#CCCCCC]/50 hover:bg-[#CCCCCC]/80"
            } transition-colors px-4 py-2 rounded-full text-sm font-bold cursor-none w-full flex items-center justify-center gap-2`}
          >
            <img src={Metamask} alt="Logo" className="w-8" />
            {privateKey ? "Disconnect Wallet" : "Connect Wallet"}
          </button>
        </div>
        {navItems.map(({ Icon, label, path }) => (
          <NavbarItem
            key={label}
            Icon={Icon}
            label={label}
            navigate={() => handleNavigation(path, label)}
            checked={label !== "Sign Out" && path === window.location.pathname}
          />
        ))}
      </div>
    </div>
  );
};
