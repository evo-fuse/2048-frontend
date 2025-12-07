import {
  IoDocumentTextOutline,
  IoStorefrontOutline,
  IoWalletOutline,
  IoColorPaletteOutline,
  IoGameControllerOutline,
} from "react-icons/io5";
import { PiMagicWand } from "react-icons/pi";
import { LuDices } from "react-icons/lu";
import { IconType } from "react-icons";
import { PATH } from "../../../const";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlCamrecorder } from "react-icons/sl";
import { useEffect, useRef, useState } from "react";
import { Hex } from "./Hex";
import { WalletConnectButton } from "./WalletConnectButton";

const navItems = [
  {
    Icon: IoGameControllerOutline,
    label: "Game",
    path: PATH.GAME,
  },
  {
    Icon: SlCamrecorder,
    label: "Replay",
    path: `${PATH.GAME}${PATH.RECORD}`,
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
    Icon: LuDices,
    label: "Betting",
    path: `${PATH.GAME}${PATH.BETTING}`,
  },
  {
    Icon: IoColorPaletteOutline,
    label: "Theme",
    path: `${PATH.GAME}${PATH.THEME}`,
  },
  {
    Icon: PiMagicWand,
    label: "AI Theme Generator",
    path: `${PATH.GAME}${PATH.AI_THEME_GENERATOR}`,
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
  const [showTooltip, setShowTooltip] = useState(false);
  const hexRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (checked) {
      hexRef.current && (hexRef.current.style.filter = "drop-shadow(0 0 12px rgba(34, 211, 238, 1))");
    } else {
      hexRef.current && (hexRef.current.style.filter = "drop-shadow(0 0 12px rgba(34, 211, 238, 0))");
    }
  }, [checked]);

  return (
    <div className="relative">
      {/* Tooltip - Simple, no animation */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, rotate: 30 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -30 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="absolute left-[80px] top-[27.2px] -rotate-[60deg] w-16 border-t-2 border-white"></div>
            <div className="absolute left-32 w-6 border-t-2 border-white"></div>
            <div className="absolute text-white left-40 -top-[12px] bg-gray-800 px-2 py-1 rounded-md border border-white text-nowrap">
              {label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hexagon Border with Glow */}
      <div
        ref={hexRef}
        className="relative transition-all duration-150"
        onMouseEnter={() => { !checked && hexRef.current && (hexRef.current.style.filter = "drop-shadow(0 0 12px rgba(34, 211, 238, 1))") }}
        onMouseLeave={() => { !checked && hexRef.current && (hexRef.current.style.filter = "drop-shadow(0 0 12px rgba(34, 211, 238, 0))") }}
      >
        {/* Outer Layer - Cyan gradient */}
        <Hex
          className={`relative flex items-center justify-center gap-4 py-2 ${checked ? 'bg-cyan-400' : 'bg-gray-600'
            }`}
          width={128}
          onClick={navigate}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          whileHover={{
            scale: 1.08,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Second Layer - Dark background */}
          <Hex
            className="bg-gray-800 flex items-center justify-center"
            width={120}
          >
            {/* Third Layer - Cyan border */}
            <Hex
              className={`flex items-center justify-center ${checked ? 'bg-cyan-200' : 'bg-white/30'
                }`}
              width={112}
            >
              {/* Fourth Layer - Dark center */}
              <Hex
                className="bg-gray-800 flex items-center justify-center"
                width={104}
              >
                {checked ? (
                  /* Active State - Cyan inner layer */
                  <div style={{ filter: "drop-shadow(0 0 8px rgba(254, 240, 138, 0.5))" }}>
                    <Hex
                      className="bg-yellow-200 flex items-center justify-center"
                      width={88}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "backOut",
                      }}
                    >
                      {/* Innermost Layer - Dark center */}
                      <Hex
                        className="bg-gray-800 flex items-center justify-center"
                        width={80}
                      >
                        {/* Icon with hover animation only */}
                        <motion.div
                          whileHover={{
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: 1.15,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon
                            size={36}
                            className="text-white drop-shadow-lg"
                            style={{
                              filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))",
                            }}
                          />
                        </motion.div>
                      </Hex>
                    </Hex>
                  </div>
                ) : (
                  /* Inactive State - Simple icon with hover only */
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon
                      size={36}
                      className="text-white drop-shadow-lg"
                    />
                  </motion.div>
                )}
              </Hex>
            </Hex>
          </Hex>
        </Hex>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isBettingRoute = (pathname: string) => {
    const bettingRoutes = [
      `${PATH.GAME}${PATH.BETTING}`,
      `${PATH.GAME}${PATH.DEPOSIT}`,
      `${PATH.GAME}${PATH.WITHDRAW}`,
      `${PATH.GAME}${PATH.BLOCK_BINGO}`,
    ];
    return bettingRoutes.some(route => pathname.includes(route));
  };

  return (
    <div className="max-w-80 w-full flex flex-col items-center justify-start py-8 gap-4 relative z-20">
      <div className="flex flex-col w-full gap-8 items-center justify-center">
        <WalletConnectButton />
        <div className="flex gap-4 relative max-w-60 h-[546.8px]">
          <div className="top-[64px] flex flex-col gap-4 relative left-28">
            {navItems.map(({ Icon, label, path }, idx) => (
              idx % 2 === 1 && <NavbarItem
                key={label}
                Icon={Icon}
                label={label}
                navigate={() => handleNavigation(path)}
                checked={
                  label === "Betting"
                    ? isBettingRoute(location.pathname)
                    : path.replace("/", "") === location.pathname.replace("/", "")
                }
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 relative -left-36">
            {navItems.map(({ Icon, label, path }, idx) => {
              return (
                idx % 2 === 0 && <NavbarItem
                  key={label}
                  Icon={Icon}
                  label={label}
                  navigate={() => handleNavigation(path)}
                  checked={
                    label === "Betting"
                      ? isBettingRoute(location.pathname)
                      : path.replace(/\//g, "") === location.pathname.replace(/\//g, "")
                  }
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
