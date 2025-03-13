import { UserButton, useUser } from "@clerk/clerk-react";
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
    path: PATH.THEME,
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
        checked ? "bg-gray-600/50" : "hover:bg-gray-600/50"
      }`}
      onClick={navigate}
    >
      <Icon size={28} className="text-white" />
      <span className="text-white text-2xl font-bold">{label}</span>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <div className="w-64 h-full bg-gray-600/50 backdrop-blur-md flex flex-col items-center justify-start py-8 gap-4">
      <img src={Images.Logo} alt="Logo" className="w-64" />
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center justify-start gap-4 px-8 py-2">
          <UserButton />
          <span className="text-white text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        {navItems.map(({ Icon, label, path }) => (
          <NavbarItem
            key={label}
            Icon={Icon}
            label={label}
            navigate={() => navigate(path)}
            checked={path === window.location.pathname}
          />
        ))}
      </div>
    </div>
  );
};
