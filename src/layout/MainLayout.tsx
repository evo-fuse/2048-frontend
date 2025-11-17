import { motion } from "framer-motion";
import { Images } from "../assets/images";
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "../const";
import { IoArrowBack } from "react-icons/io5";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isGameRoute = location.pathname === PATH.GAME || location.pathname.startsWith(`${PATH.GAME}/`);

  // const videoRef = useRef<HTMLVideoElement>(null);
  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.playbackRate = 0.5;
  //   }
  // }, []);
  return (
    <div className="bg-gray-800 w-full h-full overflow-hidden flex justify-center">
      <img
        src={Images.BACKGROUND}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      />
      <div className="fixed w-screen h-screen top-0 left-0 bg-black/70" />
      {!isGameRoute && (
        <motion.button
          className="fixed top-8 left-8 z-20 p-3 border-2 border-white/20 text-white font-bold rounded-full transition-all duration-300 cursor-none flex items-center gap-2"
          onClick={() => navigate(PATH.GAME)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoArrowBack size={20} />
        </motion.button>
      )}
      <div
        className="relative z-10 w-[1600px] flex flex-col justify-start items-center mt-0"
      >
        <motion.div
          className="w-full h-full flex flex-col"
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

export const withMainLayout =
  (Page: React.FC): React.FC =>
    () => {
      return (
        <MainLayout>
          <Page />
        </MainLayout>
      );
    };
