import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Images } from "../../../assets/images";
import { BottomRow, MenuButton, MiddleRow, TopRow } from "../../../components";
import { PATH } from "../../../const";
import { useNavigate } from "react-router-dom";

export const MoreGamesView: React.FC = () => {
  const navigate = useNavigate();

  const fadeAnimation = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    }),
    []
  );

  const slideAnimation = useMemo(
    () => ({
      initial: { x: 200, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 200, opacity: 0 },
      transition: { duration: 0.5, type: "spring", stiffness: 100 },
    }),
    []
  );

  const imageAnimation = useMemo(
    () => ({
      initial: {
        opacity: 0,
        x: 0,
        rotate: 270,
        transition: { duration: 1, type: "spring" },
      },
      animate: {
        opacity: 0.8,
        x: 0,
        rotate: 0,
        transition: { duration: 1, type: "spring" },
      },
      exit: {
        opacity: 0,
        x: 0,
        rotate: 180,
        transition: { duration: 1, type: "spring" },
      },
    }),
    []
  );

  const handleBackClick = () => navigate(PATH.HOME);

  const middleRows = useMemo(
    () =>
      [...Array(5)].map((_, index) => (
        <React.Fragment key={`middle-row-${index}`}>
          <MiddleRow />
        </React.Fragment>
      )),
    []
  );

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        {...fadeAnimation}
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <img src={Images.Texture} className="fixed w-[1300px] h-[800px] z-10" />
        <div className="fixed flex flex-col z-30 items-center justify-center gap-8">
          <div className="flex items-center justify-center gap-8">
            <motion.img
              src={Images.ICOLogo}
              {...imageAnimation}
              whileHover={{
                scale: 1.1,
                transition: {
                  duration: 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                },
              }}
              className="w-60 h-60 text-yellow-300"
            />
            <motion.img
              src={Images.ConnectFour}
              {...imageAnimation}
              className="w-60 h-60 text-yellow-300 rounded-2xl grayscale"
            />
          </div>
          <motion.img
            {...slideAnimation}
            src={Images.CommingSoon}
            width={400}
            alt="Coming Soon"
          />
          <MenuButton
            onClick={handleBackClick}
            width={216}
            height={80}
            text="back-sm"
            delay={0.7}
          />
        </div>
        <div className="flex flex-col relative z-20">
          <TopRow ImageType={Images.Ht} count={11} />
          {middleRows}
          <BottomRow count={11} />
        </div>
      </motion.div>
    </div>
  );
};
