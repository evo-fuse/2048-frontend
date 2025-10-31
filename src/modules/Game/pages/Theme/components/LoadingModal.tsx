import { motion } from "framer-motion";
import { CiImageOn } from "react-icons/ci";

export const LoadingModal = () => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/20 border border-white/10 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center gap-3 w-96"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{
            x: [-100, 0, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <CiImageOn className="text-white text-4xl" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0.5, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="text-white text-xl"
        >
          Loading theme assets...
        </motion.p>
      </motion.div>
    </div>
  );
}; 