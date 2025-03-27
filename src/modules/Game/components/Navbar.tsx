import { Images } from "../../../assets/images";
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
    <div
      className={`w-full flex items-center justify-start gap-4 px-8 py-2 transition-colors ${
        checked ? "bg-[#FB923C]/10" : "hover:bg-gray-600/50"
      }`}
      onClick={navigate}
    >
      <Icon
        size={24}
        className={`${checked ? "text-[#FB923C]" : "text-white"}`}
      />
      <span
        className={`${
          checked ? "text-[#FB923C]" : "text-white"
        } text-xl font-bold`}
      >
        {label}
      </span>
    </div>
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
    <div className="min-w-72 h-full bg-gray-600/50 backdrop-blur-md flex flex-col items-center justify-start py-8 gap-4">
      <img src={Images.Logo} alt="Logo" className="w-64" />
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center justify-between px-8 py-2">
          <button
            onClick={privateKey ? handleDisconnectWallet : onOpenWalletConnect}
            className={`text-white ${
              privateKey
                ? "bg-gray-600/50 hover:bg-gray-600/80"
                : "bg-[#FB923C] hover:bg-[#FB923C]/80"
            } transition-colors px-3 py-2 rounded-md text-sm font-bold cursor-none w-full`}
          >
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
