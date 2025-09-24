import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PATH } from "../../../const";
import { FaBitcoin } from "react-icons/fa";
import { SiEthereum, SiBinance } from "react-icons/si";
import { Images } from "../../../assets/images";

export const LandingView: React.FC = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [rotation, setRotation] = useState(0);

  // Animate rotation around the center
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 0.1) % 360);
    }, 40);
    
    return () => clearInterval(rotationInterval);
  }, []);

  const handleSignIn = () => {
    setShow(false);
    setTimeout(() => navigate(PATH.GAME + PATH.HOME), 300);
  };

  // Tile number data for floating elements
  const tileNumbers = [2, 8, 32, 128, 512, 2048];

  // Color mapping for tile numbers
  const tileColors: Record<number, string> = {
    2: "bg-[#eee4da]",
    8: "bg-[#f2b179]",
    32: "bg-[#f67c5f]",
    128: "bg-[#edcf72]",
    512: "bg-[#edc53f]",
    2048: "bg-[#edc22e]",
  };

  const textColors: Record<number, string> = {
    2: "text-[#776e65]",
    8: "text-white",
    32: "text-white",
    128: "text-white",
    512: "text-white",
    2048: "text-white",
  };
  
  // Crypto icons data for floating elements
  const cryptoIcons = [
    { icon: FaBitcoin, color: "text-amber-500" },
    { icon: SiEthereum, color: "text-blue-400" },
    { icon: SiBinance, color: "text-yellow-400" }
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden"
        >
          {/* Dark theme background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gray-950"></div>

            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "linear-gradient(#444 1px, transparent 1px), linear-gradient(to right, #444 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            ></div>
          </div>

          {/* Floating tile numbers */}
          {tileNumbers.map((number, index) => {
            // Calculate positions using a circular distribution around center
            // This ensures tiles are evenly spread in a circular pattern
            const angleStep = (2 * Math.PI) / tileNumbers.length;
            // Add rotation state to create circular movement
            const angle = angleStep * index + (rotation * Math.PI / 180);

            // Radius varies slightly for each tile to create natural distribution
            // Smaller radius keeps tiles closer to center of screen
            const radius = 25 + (index % 3) * 8;

            // Convert polar coordinates to cartesian (x, y)
            // Center is at 50%, 50% and radius determines distance from center
            const xPos = 50 + radius * Math.cos(angle);
            const yPos = 50 + radius * Math.sin(angle);

            return (
              <motion.div
                key={`tile-${index}`}
                className={`absolute shadow-lg ${tileColors[number]} rounded-lg flex items-center justify-center`}
                style={{
                  width:
                    number === 2048
                      ? "120px"
                      : number >= 128
                      ? "100px"
                      : "80px",
                  height:
                    number === 2048
                      ? "120px"
                      : number >= 128
                      ? "100px"
                      : "80px",
                  fontSize:
                    number === 2048 ? "36px" : number >= 128 ? "32px" : "28px",
                  fontWeight: "bold",
                  left: `${xPos}%`,
                  top: `${yPos}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0.7, 0.9, 0.7],
                  y: [0, -20, 0],
                  rotate: [0, number % 8 === 0 ? 10 : -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 5 + (index % 3),
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              >
                <span className={`${textColors[number]}`}>{number}</span>
              </motion.div>
            );
          })}
          
          {/* Floating crypto icons */}
          {cryptoIcons.map((crypto, index) => {
            // Calculate positions for crypto icons
            // Using a different distribution to avoid overlapping with tiles
            const angleStep = (2 * Math.PI) / cryptoIcons.length;
            // Offset angle to position between tile numbers and add rotation
            // Rotate in opposite direction for visual interest
            const angle = angleStep * index + Math.PI / 6 - (rotation * Math.PI / 180);
            
            // Use a different radius for crypto icons
            const radius = 35 + (index % 3) * 5;
            
            // Calculate position
            const xPos = 50 + radius * Math.cos(angle);
            const yPos = 50 + radius * Math.sin(angle);
            
            const IconComponent = crypto.icon;
            
            return (
              <motion.div
                key={`crypto-${index}`}
                className={`absolute shadow-lg bg-gray-900/80 rounded-full flex items-center justify-center`}
                style={{
                  width: "80px",
                  height: "80px",
                  left: `${xPos}%`,
                  top: `${yPos}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  y: [0, -15, 0],
                  rotate: [0, index % 2 === 0 ? 15 : -15, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4 + (index % 3),
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: index * 0.7 + 0.3,
                }}
              >
                <IconComponent className={`text-4xl ${crypto.color}`} />
              </motion.div>
            );
          })}

          {/* Main content container */}
          <motion.div
            className="relative z-10 max-w-4xl w-full flex flex-col items-center"
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
              className="text-center mb-12"
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
                  className="text-6xl md:text-8xl font-bold flex items-center gap-6 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent leading-tight mb-2"
                  style={{ fontFamily: "Patrick Hand" }}
                >
                  EvoFuse <img src={Images.Logo} alt="Logo" className="w-40 h-40" />
                </div>
                {/* Title glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-300/20 via-yellow-200/20 to-amber-300/20 blur-3xl opacity-60"></div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="w-48 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
              </div>
            </motion.div>

            {/* Play button */}
            <motion.button
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.7 },
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              onClick={handleSignIn}
            >
              {/* Flat design button */}
              <div className="bg-amber-500 rounded-lg px-16 py-4 shadow-lg transition-all duration-300 group-hover:bg-amber-400">
                <span
                  className="text-2xl font-medium text-gray-100 tracking-wide"
                  style={{ fontFamily: "Patrick Hand" }}
                >
                  PLAY
                </span>
              </div>
            </motion.button>
          </motion.div>


          {/* Decorative elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6, transition: { duration: 1, delay: 1.2 } }}
          >
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <div className="w-16 h-px bg-amber-400/50"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
