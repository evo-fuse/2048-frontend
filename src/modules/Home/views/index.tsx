import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { MenuButton } from "../../../components";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../const";
import { Images } from "../../../assets/images"; // Import the Images constant

export const HomeView: React.FC = () => {
  const [showMenu, setShowMenu] = useState(true);
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    setShowMenu(false);
    setTimeout(() => {
      navigate(path);
    }, 500); // Delay showing modal until after menu disappears
  };

  const handleCloseModal = () => {
    setModal(false);
  };

  const handleQuit = () => {
    if (window.electron) {
      window.electron.closeApp();
    }
  };

  return (
    <motion.div className="flex items-start justify-start h-full">
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              exit={{ opacity: 0, x: -200 }}
              className="flex flex-col min-w-max h-full items-center justify-evenly gap-4 w-80"
            >
              <motion.img
                exit={{ opacity: 0, y: -200 }}
                src={Images.Logo} // Use Images constant
                className="max-w-[540px] translate-x-[2px]"
              />
              <MenuButton
                text="start"
                onClick={() => {
                  setModal(true);
                }}
                delay={0.7}
              />
              <MenuButton
                text="setting"
                onClick={() => handleMenuClick(PATH.SETTING)}
                delay={0.8}
              />
              <MenuButton
                text="credits"
                onClick={() => handleMenuClick(PATH.CREDITS)}
                delay={0.9}
              />
              <MenuButton
                text="quit"
                onClick={() => handleQuit()}
                delay={1.0}
              />
            </motion.div>
            <motion.div className="flex flex-col w-full h-full items-end justify-end pb-8 pr-[448px]">
              <motion.div
                onClick={() => handleMenuClick(PATH.ICO)}
                whileHover={{ scale: 1.05, transition: { duration: 0.5, type: "spring" } }}
                className="w-60 h-60 flex items-center justify-center relative z-10"
              >
                <motion.img
                  src={Images.ICOLogo}
                  initial={{ opacity: 0, x: 0, rotate: 270, transition: { duration: 1, type: "spring" } }}
                  animate={{ opacity: 0.8, x: 0, rotate: 0, transition: { duration: 1, type: "spring" } }}
                  exit={{ opacity: 0, x: 0, rotate: 180, transition: { duration: 1, type: "spring" } }}
                  className="w-full h-full text-yellow-300"
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/70 z-30"
          >
            <img src={Images.Texture} className="fixed w-[690px] h-[430px] z-10" />
            <div className="fixed flex flex-col z-30 items-center justify-center gap-8">
              <motion.img
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                src={Images.CommingSoon} // Use Images constant
                width={400}
              />
              <MenuButton
                text="back-sm"
                width={216}
                height={80}
                onClick={handleCloseModal}
                delay={0.7}
              />
            </div>
            <div className="flex flex-col relative z-20">
              <div className="flex items-center justify-center">
                <img src={Images.Lt} width={120} height={120} />
                <img src={Images.Ht} width={120} height={120} />
                <img src={Images.Ht} width={120} height={120} />
                <img src={Images.Ht} width={120} height={120} />
                <img src={Images.Ht} width={120} height={120} />
                <img src={Images.Rt} width={120} height={120} />
              </div>
              <div className="flex items-center justify-between px-[3px]">
                <img src={Images.Vl} width={120} height={120} className="translate-x-[1px]" />
                <img src={Images.Vr} width={120} height={120} className="translate-x-[-1.5px]" />
              </div>
              <div className="flex items-center justify-between px-[3px]">
                <img src={Images.Vl} width={120} height={120} className="translate-x-[1px]" />
                <img src={Images.Vr} width={120} height={120} className="translate-x-[-1.5px]" />
              </div>
              <div className="flex items-center justify-center">
                <img src={Images.Lb} width={120} height={120} />
                <img src={Images.Hb} width={120} height={120} />
                <img src={Images.Hb} width={120} height={120} />
                <img src={Images.Hb} width={120} height={120} />
                <img src={Images.Hb} width={120} height={120} />
                <img src={Images.Rb} width={120} height={120} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
