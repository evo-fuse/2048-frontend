import { Images } from "../assets/images";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);
  return (
    <div className="bg-gray-800 w-full h-full overflow-hidden flex justify-center">
      <img
        src={Images.BACKGROUND}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      />
      <div className="relative z-10 w-[1760px] flex flex-col justify-start items-center mt-0">
        <motion.div
          className="w-full flex flex-col h-full"
          initial={{ y: -100, opacity: 0 }}
          exit={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export const withHomeLayout =
  (Page: React.FC): React.FC =>
  () => {
    return (
      <HomeLayout>
        <Page />
      </HomeLayout>
    );
  };
