import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PATH } from "../../../const";

export const IcoView: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const handleSignIn = () => {
    setShow(false);
    setTimeout(() => navigate(PATH.GAME + PATH.LOADING), 300);
  };

  const motionProps = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 50 },
    whileHover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
          {/* Sophisticated background elements */}
          <div className="absolute inset-0">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black"></div>
            
            {/* Elegant geometric patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-20 left-20 w-64 h-64 border border-gray-600/30 rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-96 h-96 border border-gray-600/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-gray-600/25 rounded-full"></div>
            </div>
            
            {/* Subtle light effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-500/5 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-purple-500/5 to-transparent"></div>
          </div>

          {/* Main content container */}
          <motion.div
            className="relative z-10 max-w-5xl w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } }}
            exit={{ opacity: 0, y: 40 }}
          >
            {/* Luxury glass card */}
            <div className="backdrop-blur-2xl bg-gray-900/40 border border-gray-700/50 rounded-3xl shadow-2xl p-16 relative overflow-hidden">
              {/* Card inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-3xl"></div>
              
              {/* Content wrapper */}
              <div className="relative z-10">
                {/* Elegant title */}
                <motion.div
                  className="text-center mb-20"
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5 } }}
                  exit={{ opacity: 0, y: -40 }}
                >
                  <div className="mb-6">
                    <span className="text-sm md:text-base text-amber-400/80 tracking-widest uppercase font-medium">
                      Premium Experience
                    </span>
                  </div>
                  <h1 
                    className="text-4xl md:text-6xl font-light text-gray-200 mb-6 tracking-wide"
                    style={{ fontFamily: "Patrick Hand" }}
                  >
                    Welcome to
                  </h1>
                  <div className="relative">
                    <h2 
                      className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent leading-tight"
                      style={{ fontFamily: "Patrick Hand" }}
                    >
                      earn DWAT
                    </h2>
                    {/* Enhanced title glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-300/30 via-yellow-200/30 to-amber-300/30 blur-3xl opacity-60"></div>
                  </div>
                  <div className="mt-8 flex justify-center">
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
                  </div>
                </motion.div>

                {/* Sophisticated button section */}
                <div className="flex flex-col items-center gap-16">
                  <motion.button
                    className="relative group"
                    {...motionProps}
                    onClick={handleSignIn}
                    style={{ transitionDelay: "0.7s" }}
                  >
                    {/* Enhanced luxury button */}
                    <div className="backdrop-blur-xl bg-gradient-to-r from-amber-500/25 to-yellow-500/25 border border-amber-400/40 rounded-3xl px-20 py-10 shadow-2xl hover:shadow-amber-500/25 transition-all duration-700 group-hover:from-amber-500/35 group-hover:to-yellow-500/35 group-hover:border-amber-300/60 group-hover:scale-105">
                      <div className="flex items-center gap-4">
                        <span 
                          className="text-2xl font-medium text-amber-100 tracking-wide"
                          style={{ fontFamily: "Patrick Hand" }}
                        >
                          Get Started
                        </span>
                        <motion.div
                          className="w-6 h-6 border-2 border-amber-300/60 rounded-full flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Enhanced button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/40 to-yellow-400/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </motion.button>

                  {/* Enhanced elegant description */}
                  <motion.div
                    className="text-center max-w-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.9 } }}
                    exit={{ opacity: 0, y: 30 }}
                  >
                    <p 
                      className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed font-light tracking-wide mb-6"
                      style={{ fontFamily: "Patrick Hand" }}
                    >
                      Join us on an exciting journey to earn DWAT and explore new adventures!
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/50"></div>
                      <div className="w-2 h-2 bg-amber-400/60 rounded-full"></div>
                      <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/50"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating luxury elements */}
          <motion.div
            className="absolute top-24 left-24 w-2 h-2 bg-amber-400/80 rounded-full"
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <motion.div
            className="absolute bottom-32 right-32 w-3 h-3 bg-yellow-400/60 rounded-full"
            animate={{ 
              y: [0, 20, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          <motion.div
            className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-amber-300/70 rounded-full"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.8
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
