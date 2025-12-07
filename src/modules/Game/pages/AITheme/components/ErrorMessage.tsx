import { motion } from "framer-motion";
import { IoCloseCircle } from "react-icons/io5";

interface ErrorMessageProps {
    error: string | null;
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => {
    if (!error) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3"
        >
            <IoCloseCircle className="text-red-400 text-2xl" />
            <span className="text-red-400">{error}</span>
        </motion.div>
    );
};

