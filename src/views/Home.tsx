import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fontsource/patrick-hand";
import { MenuButton } from "../components";
import { useNavigate, Navigate } from "react-router-dom";
import Logo from "../assets/images/logo (3).jpeg";
import { PATH } from "../const";
import { SignedIn, SignInButton } from "@clerk/clerk-react";
// import Rt from "../assets/images/modal/right upper corner.png";
// import Rb from "../assets/images/modal/right bottom corner.png";
// import Lt from "../assets/images/modal/left upper corner.png";
// import Lb from "../assets/images/modal/left bottom corner.png";
// import Hr from "../assets/images/modal/horizontal segment.png";
// import Vr from "../assets/images/modal/vertical segment.png";
// Define the electronAPI interface
declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => Promise<void>;
    };
  }
}

export const HomeView: React.FC = () => {
  const [showMenu, setShowMenu] = useState(true);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    setShowMenu(false);
    setTimeout(() => {
      navigate(path);
    }, 500); // Delay showing modal until after menu disappears
  };

  return (
    <div className="flex flex-col items-start justify-start">
      <AnimatePresence>
        {showMenu && (
          <motion.div className="flex flex-col min-w-max items-center gap-4 w-80">
            <motion.img
              exit={{ opacity: 0, y: -200 }}
              src={Logo}
              className="max-w-[540px] my-4"
            />
            <SignedIn>
              <Navigate to={PATH.STEP_1} />
            </SignedIn>
            <SignInButton>
              <MenuButton
                text="start"
                onClick={() => handleMenuClick("/")}
                delay={0.7}
              />
            </SignInButton>
            <MenuButton
              text="setting"
              onClick={() => handleMenuClick(PATH.SETTING)}
              delay={0.8}
            />
            <MenuButton
              text="credits"
              onClick={() => handleMenuClick("Settings")}
              delay={0.9}
            />
            <MenuButton
              text="quit"
              onClick={() => handleMenuClick("Quit")}
              delay={1.0}
            />
          </motion.div>
        )}
        {/* <motion.div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/70">
          <div className="flex flex-col">
            <div className="flex items-center justify-center">
              <img src={Rt} width={48} />
              <img src={Vr} className="-translate-y-[14px]" width={96} />
              <img src={Vr} className="-translate-y-[14px]" width={96} />
              <img src={Vr} className="-translate-y-[14px]" width={96} />
              <img src={Vr} className="-translate-y-[14px]" width={96} />
              <img src={Lt} width={48} />
            </div>
            <div className="flex items-center justify-between px-[3px]">
              <img src={Hr} width={10} />
              <img src={Hr} width={10} />
            </div>
            <div className="flex items-center justify-between px-[3px]">
              <img src={Hr} width={10} />
              <img src={Hr} width={10} />
            </div>
            <div className="flex items-center justify-center">
              <img src={Rb} width={48} />
              <img src={Vr} className="translate-y-[14px]" width={96} />
              <img src={Vr} className="translate-y-[14px]" width={96} />
              <img src={Vr} className="translate-y-[14px]" width={96} />
              <img src={Vr} className="translate-y-[14px]" width={96} />
              <img src={Lb} width={48} />
            </div>
          </div>
        </motion.div> */}
      </AnimatePresence>
    </div>
  );
};
