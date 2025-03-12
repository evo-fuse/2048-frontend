import { AnimatePresence } from "framer-motion";
import { MenuButton } from "../components";
import { PATH } from "../const";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Images } from "../assets/images";

export const SoundView: React.FC = () => {
  const navigate = useNavigate();
  const [soundEffectVolume, setSoundEffectVolume] = useState(5);
  const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(5);

  return (
    <AnimatePresence>
      <div className="flex flex-col w-full h-full items-center justify-center text-yellow-500 gap-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-4">
            <div
              className="text-3xl font-bold"
              style={{ fontFamily: "Cinzel Decorative" }}
            >
              Sound Effect Volume:
            </div>
            <div className="flex items-center justify-center">
              {Array.from({ length: 10 }).map((_, index) => (
                <img
                  src={index < soundEffectVolume ? Images.Fill : Images.Slide}
                  key={`sound-${index}`}
                  width={40}
                  onClick={() => setSoundEffectVolume(index + 1)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4">
            <div
              className="text-3xl font-bold"
              style={{ fontFamily: "Cinzel Decorative" }}
            >
              Background Music Volume:
            </div>
            <div className="flex items-center justify-center">
              {Array.from({ length: 10 }).map((_, index) => (
                <img
                  src={index < backgroundMusicVolume ? Images.Fill : Images.Slide}
                  key={`background-${index}`}
                  width={40}
                  onClick={() => setBackgroundMusicVolume(index + 1)}
                />
              ))}
            </div>
          </div>
          <img src={Images.Logo} alt="Logo" className="mt-4" />
          <MenuButton
            text="Back"
            onClick={() => navigate(PATH.HOME)}
            delay={0.7}
          />
        </div>
      </div>
    </AnimatePresence>
  );
};
