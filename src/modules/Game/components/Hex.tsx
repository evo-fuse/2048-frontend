import { HTMLMotionProps, motion } from "framer-motion";

const ROOT_3 = Math.sqrt(3);

interface HexProps {
    width: number;
    className: string;
    children?: React.ReactNode;
}
export const Hex: React.FC<HexProps & HTMLMotionProps<"div">> = ({
    width, className, children, ...props
}) => {
    return (
        <motion.div
            className={className}
            style={{
                clipPath: "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)",
                width,
                height: width * ROOT_3 / 2
            }}
            {...props}
        >
            {children}
        </motion.div>
    )
}