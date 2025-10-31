import { motion } from "framer-motion";

interface MenuButtonProps {
  text: string;
  onClick: () => void;
  delay: number;
  width?: number;
  height?: number;
}

export const MenuButton = ({ text, onClick, delay, width=360, height=133 }: MenuButtonProps) => {
  return (
    <motion.button
      className={`text-white py-3 px-6 rounded-lg flex items-center justify-center ${text} h-[119px] w-[320px]`}
      initial={{
        x: -100,
        opacity: 0,
        transition: { delay: 0.0, duration: 0.15 },
      }}
      animate={{ x: 0, opacity: 1 }}
      exit={{
        x: -100,
        opacity: 0,
        transition: { delay: delay - 0.7, duration: 0.3 },
      }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      style={{width, height}}
    >
    </motion.button>
  );
};
