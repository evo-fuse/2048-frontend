import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/patrick-hand";
import { MenuButton } from "../components";
import { useNavigate } from "react-router-dom";
import { PATH } from "../const";
import Logo from "../assets/images/logo (3).jpeg";

// Define the electronAPI interface
declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => Promise<void>;
    };
  }
}

export const SettingView: React.FC = () => {
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    setShowMenu(false);
    setTimeout(() => {
      navigate(path);
    }, 500); // Delay showing modal until after menu disappears
  };

  return (
    <div className="flex w-full justify-start">
      <AnimatePresence>
        {showMenu && (
          <motion.div className="flex flex-col min-w-max items-center gap-4 w-80">
            <motion.img exit={{ opacity: 0, y: -200 }} src={Logo} className="max-w-[540px] my-4" />
            <MenuButton
              text="controller"
              onClick={() => handleMenuClick(PATH.CONTROLLER)}
              delay={0.7}
            />
            <MenuButton
              text="screen"
              onClick={() => handleMenuClick(PATH.SETTING)}
              delay={0.8}
            />
            <MenuButton
              text="sound"
              onClick={() => handleMenuClick("Settings")}
              delay={0.9}
            />
            <MenuButton
              text="back"
              onClick={() => handleMenuClick(PATH.HOME)}
              delay={1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
