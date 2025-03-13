import { AnimatePresence, motion } from "framer-motion";
import { MenuButton } from "../../../../../components";
import { PATH } from "../../../../../const";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Images } from "../../../../../assets/images";

export const SoundView: React.FC = () => {
  const navigate = useNavigate();
  const [soundEffectVolume, setSoundEffectVolume] = useState(5);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(5);
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate(PATH.SETTING);
    }, 500); // Delay navigation to allow animation to complete
  };

  return (
    <div className="w-full h-full">
      <AnimatePresence>
        {!isExiting ? (
          <motion.div
            className="flex flex-col w-full h-full"
            key="sound-view"
          >
            <motion.div className="flex pt-8 items-start justify-start">
              <motion.img
                src={Images.Logo}
                className="max-w-[540px]"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.15 }}
              />
            </motion.div>

            <motion.div
              className="flex flex-col w-full h-full items-center justify-center text-yellow-500 gap-4"
            >
              <motion.div className="flex flex-col gap-8 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 200 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-start gap-4"
                >
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "Cinzel Decorative" }}
                  >
                    Sound Effect Volume:
                  </div>
                  <div className="flex items-center justify-center">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <img
                        src={
                          index < soundEffectVolume ? Images.Fill : Images.Slide
                        }
                        key={`sound-${index}`}
                        width={40}
                        onClick={() => setSoundEffectVolume(index + 1)}
                      />
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col items-start gap-4"
                >
                  <div
                    className="text-3xl font-bold"
                    style={{ fontFamily: "Cinzel Decorative" }}
                  >
                    Background Music Volume:
                  </div>
                  <div className="flex items-center justify-center">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <img
                        src={
                          index < backgroundMusicVolume
                            ? Images.Fill
                            : Images.Slide
                        }
                        key={`background-${index}`}
                        width={40}
                        onClick={() => setBackgroundMusicVolume(index + 1)}
                      />
                    ))}
                  </div>
                </motion.div>
                <div className="flex items-center justify-center w-full">
                  <MenuButton
                    text="back-sm"
                    width={216}
                    height={80}
                    onClick={handleBack}
                    delay={0.7}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
