import { UserButton } from "@clerk/clerk-react";
import { AnimatePresence } from "framer-motion";
import { AvatarGenerator } from "../components";
import { Images } from "../assets/images";

export const StepOneView: React.FC = () => {
  return (
    <AnimatePresence>
      <div className="flex w-full h-full items-center justify-center">
        <div className="flex w-[1440px] h-[720px] backdrop-blur-sm bg-black/70 rounded-md">
          <div className="flex flex-col items-center justify-start">
            <UserButton />
            <img src={Images.Logo} alt="Logo" className="mt-4" />
          </div>
          <AvatarGenerator />
        </div>
      </div>
    </AnimatePresence>
  );
};
