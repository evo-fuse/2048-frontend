import { UserButton } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";

export const StepOneView: React.FC = () => {
  return (
    <AnimatePresence>
      <div className="flex w-full h-full items-center justify-center">
        <div className="flex w-[1440px] h-[720px] backdrop-blur-sm bg-black/70 rounded-md">
          <UserButton />
        </div>
      </div>
    </AnimatePresence>
  );
};
