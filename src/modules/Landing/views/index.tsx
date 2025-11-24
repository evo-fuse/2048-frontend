import { AnimatePresence, motion } from "framer-motion";
import { useImageLoad } from "../../../context";
import { Images } from "../../../assets/images";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../const";

// Generate random stars with different properties
const generateStars = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2, // 2-5px
    duration: Math.random() * 20 + 15, // 15-35s for smoother motion
    delay: Math.random() * 10,
    opacity: Math.random() * 0.3 + 0.7, // 0.7-1
    xPath: [0, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, 0],
    yPath: [0, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, 0],
  }));
};

export const LandingView: React.FC = () => {
  const { loadedCount, totalImages } = useImageLoad();
  const stars = useMemo(() => generateStars(50), []); // 50 stars
  const navigate = useNavigate();
  useEffect(() => {
    if (loadedCount === totalImages) {
      navigate(PATH.GAME + PATH.HOME);
    }
  }, [loadedCount, totalImages, navigate]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          <img src={Images.BG_LOADING} alt="background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Floating Stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              boxShadow: `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.8)`,
              filter: 'blur(0.5px)',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: star.opacity,
            }}
            animate={{
              x: star.xPath,
              y: star.yPath,
              opacity: star.opacity,
              scale: [1, 1.3, 1.5, 1.3, 1],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: "linear",
              opacity: {
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        ))}

        {/* Main content container */}
        <motion.div
          className="relative z-10 max-w-4xl w-full flex flex-col items-center px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, delay: 0.3 },
          }}
          exit={{ opacity: 0, y: 40 }}
        >
          {/* Title section */}
          <motion.div
            className="text-center mb-8 sm:mb-12 flex flex-col items-center justify-center gap-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.5 },
            }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="relative">
              <div
                className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-green-600 leading-tight"
                style={{ fontFamily: "Patrick Hand" }}
              >
                <img src={Images.LOGO} alt="logo" className="w-36 h-36" />
                2048
              </div>
              {/* Title glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-purple-200/20 to-cyan-300/20 blur-3xl opacity-60"></div>
            </div>
            <div className="mt-2 sm:mt-4 flex flex-col items-center gap-3 w-full max-w-md">
              <div className="text-cyan-200 text-xl sm:text-2xl font-bold">
                Loading Assets...
              </div>
              {/* Progress bar with enhanced styling */}
              <div className="w-full relative">
                <div className="w-full h-3 sm:h-4 p-[2px] bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-full overflow-hidden border border-cyan-500/30 shadow-lg relative">
                  <motion.div
                    className="h-full bg-green-500 rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${(loadedCount / totalImages) * 100}%`,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-green-400/20 to-cyan-400/20 blur-md"></div>
                </div>
                {/* Outer glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-green-400/10 to-cyan-400/10 blur-xl rounded-full"></div>
              </div>
              {/* Progress percentage */}
              <div className="text-cyan-300/80 text-sm sm:text-base font-semibold">
                {Math.round((loadedCount / totalImages) * 100)}%
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
