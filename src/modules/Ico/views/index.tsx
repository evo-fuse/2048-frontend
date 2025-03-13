import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PATH } from "../../../const";
import { Images } from "../../../assets/images";
import { useAuth, useClerk } from "@clerk/clerk-react";
// CSS for 3D golden metallic text
const goldMetallicStyle = {
  textShadow: `
    0 0.5px 5px #EDA858,
    0 5px 0px rgba(0, 0, 0, 0.6)
  `,
  background:
    "linear-gradient(to bottom, #f0c419 0%, #f7dc6f 50%, #ffe439 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  filter: "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5))",
  fontWeight: "bold",
  letterSpacing: "2px",
};

const buttonStyle = {
  backgroundImage: `url(${Images.Texture})`,
  backgroundSize: "cover",
  backgroundPosition: "top",
  backgroundRepeat: "no-repeat",
};

export const IcoView: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(false);
    setTimeout(() => navigate(PATH.HOME), 300);
  };

  const motionProps = {
    initial: { opacity: 0, y: 100 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, type: "spring", stiffness: 300 },
    },
    exit: { opacity: 0, y: 100 },
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.3, type: "spring", stiffness: 300 },
    },
  };

  const { openSignIn } = useClerk();
  const { isSignedIn } = useAuth();
  
  useEffect(() => {
    if (isSignedIn) {
      navigate(PATH.GAME);
    }
  }, [isSignedIn, navigate]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ background: "#00000000" }}
          animate={{ background: "#00000080", transition: { duration: 0.2 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="w-full h-full flex flex-col items-center justify-center p-10 shadow-lg gap-24 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            className="text-7xl font-bold drop-shadow-lg"
            style={{ fontFamily: "Patrick Hand", ...goldMetallicStyle }}
            initial={{ opacity: 0, y: -100 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, type: "spring", stiffness: 300 },
            }}
            exit={{ opacity: 0, y: -100 }}
          >
            Welcome to earn DWAT
          </motion.div>
          <div className="flex flex-col items-center gap-4">
            <motion.button
              className="w-64 bg-gray-900 text-yellow-300 font-bold text-3xl px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
              style={{ fontFamily: "Patrick Hand", ...buttonStyle }}
              {...motionProps}
              onClick={() => {
                if (isSignedIn) {
                  navigate(PATH.GAME);
                } else {
                  openSignIn();
                }
              }}
            >
              <span style={{ fontFamily: "Patrick Hand" }}>Get Started</span>
            </motion.button>
            <motion.button
              onClick={handleClick}
              className="w-64 bg-gray-900 text-yellow-300 font-bold text-3xl px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
              style={{ fontFamily: "Patrick Hand", ...buttonStyle }}
              {...motionProps}
              animate={{
                ...motionProps.animate,
                transition: { ...motionProps.animate.transition, delay: 0.2 },
              }}
            >
              <span style={{ fontFamily: "Patrick Hand" }}>Back</span>
            </motion.button>
            <motion.div
              className="mt-8 text-3xl text-yellow-300"
              {...motionProps}
              animate={{
                ...motionProps.animate,
                transition: { ...motionProps.animate.transition, delay: 0.4 },
              }}
            >
              <p style={{ fontFamily: "Patrick Hand" }}>
                Join us on an exciting journey to earn DWAT and explore new
                adventures!
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
