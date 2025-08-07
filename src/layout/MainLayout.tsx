import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // const videoRef = useRef<HTMLVideoElement>(null);
  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.playbackRate = 0.5;
  //   }
  // }, []);
  return (
    <div className="bg-gray-800 w-full h-full overflow-hidden flex justify-center">
      {/* <img
        src={Bg}
        className="fixed top-0 left-0 w-screen h-full object-cover"
        alt="Fantasy Background"
      /> */}
      <div className="fixed w-screen h-screen top-0 left-0 bg-black/70" />
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
