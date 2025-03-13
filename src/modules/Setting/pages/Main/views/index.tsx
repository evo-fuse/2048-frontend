import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuButton } from "../../../../../components";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../../const";
import { Images } from "../../../../../assets/images";

// Define the electronAPI interface

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
    <div className="flex w-full justify-start h-full">
      <AnimatePresence>
        {showMenu && (
          <motion.div className="flex flex-col min-w-max h-full items-center justify-evenly gap-4 w-80">
            <motion.img exit={{ opacity: 0, y: -200 }} src={Images.Logo} className="max-w-[540px]" />
            <MenuButton
              text="controller"
              onClick={() => handleMenuClick(`${PATH.SETTING}${PATH.CONTROLLER}`)}
              delay={0.7}
            />
            <MenuButton
              text="screen"
              onClick={() => handleMenuClick(`${PATH.SETTING}${PATH.SCREEN}`)}
              delay={0.8}
            />
            <MenuButton
              text="sound"
              onClick={() => handleMenuClick(`${PATH.SETTING}${PATH.SOUND}`)}
              delay={0.9}
            />
            <MenuButton
              text="back"
              onClick={() => handleMenuClick(`${PATH.HOME}`)}
              delay={1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
