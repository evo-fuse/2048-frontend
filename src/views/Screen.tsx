import { AnimatePresence, motion } from "framer-motion";
import { MenuButton } from "../components";
import { PATH } from "../const";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Images } from "../assets/images";

export const ScreenView: React.FC = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);
  useEffect(() => {
    window.electron?.getFullScreen().then((isFullScreen) => {
      console.log("isFullScreen", isFullScreen);
      setFullScreen(isFullScreen);
    });
  }, []);
  const handleToggleFullScreen = () => {
    window.electron?.toggleFullScreen();
    setFullScreen(!fullScreen);
  };
  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(PATH.SETTING);
    }, 500); // Delay navigation to allow animation to complete
  };
  return (
    <AnimatePresence>
      {!isExiting ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.15 }}
          >
            <img src={Images.Logo} alt="Logo" className="mt-4 max-w-[540px]" />
          </motion.div>
          <div className="flex flex-col w-full h-full items-center justify-center text-[#BB7725] gap-4">
            <div className="flex flex-col w-[540px] gap-8">
              <div className="flex items-center justify-between">
                <div
                  className="text-4xl font-bold text-nowrap"
                  style={{ fontFamily: "Cinzel Decorative" }}
                >
                  Language:
                </div>
                <div
                  className="text-4xl font-bold bg-white/20 rounded-md px-4 py-1"
                  style={{ fontFamily: "Cinzel Decorative" }}
                >
                  English
                </div>
              </div>
              <div
                className="flex w-full items-center justify-end text-4xl font-bold"
                style={{ fontFamily: "Cinzel Decorative" }}
              >
                Germany
              </div>
              <div
                className="flex w-full items-center justify-end text-4xl font-bold"
                style={{ fontFamily: "Cinzel Decorative" }}
              >
                France
              </div>
              <div className="flex w-full items-center justify-between">
                <div
                  className="text-4xl font-bold"
                  style={{ fontFamily: "Cinzel Decorative" }}
                >
                  Full Screen:
                </div>
                <img
                  onClick={handleToggleFullScreen}
                  src={fullScreen ? Images.Check : Images.Uncheck}
                  className="w-12 h-12"
                />
              </div>
            </div>
            <MenuButton
              text="back-sm"
              width={216}
              height={80}
              onClick={handleBack}
              delay={0.7}
            />
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
};
