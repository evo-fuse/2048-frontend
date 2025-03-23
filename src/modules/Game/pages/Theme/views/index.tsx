import { AnimatePresence, motion } from "framer-motion";
import { useGameContext } from "../../../context";
import { useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import { Theme } from "../../../../../types";
import { Ribbon } from "../../../../../components";
// Loading modal component
const LoadingModal = () => {
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

export const ThemeView = () => {
  const { themes, selectedTheme, setSelectedTheme, setThemes, getThemes } =
    useGameContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getThemes().then((data) => {
      setThemes(data);
    });
  }, []);

  const handleThemeChange = async (theme: Theme | "Basic") => {
    if (theme === selectedTheme) return;

    setIsLoading(true);

    try {
      // Find the selected theme
      if (theme === "Basic") {
        setIsLoading(false);
        setSelectedTheme("Basic");
        return;
      }
      if (theme) {
        // Preload all images in the theme
        const imageUrls: string[] = [
          theme[2].sm,
          theme[4].sm,
          theme[8].sm,
          theme[16].sm,
          theme[32].sm,
          theme[64].sm,
          theme[128].sm,
          theme[256].sm,
          theme[512].sm,
          theme[1024].sm,
          theme[2048].sm,
          theme[4096].sm,
          theme[8192].sm,
        ];

        // Preload all images
        await Promise.all(
          imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = url;
            });
          })
        );
      }

      // After successful preloading, update the selected theme
    } catch (error) {
      console.error("Failed to preload theme images:", error);
    } finally {
      setIsLoading(false);
      setSelectedTheme(theme);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <AnimatePresence>{isLoading && <LoadingModal />}</AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="grid grid-cols-3 gap-2 text-[#EC9050] p-4 rounded-lg bg-black/20 border border-white/10"
      >
        <div
          className="flex flex-col gap-2 items-center justify-center"
          onClick={() => handleThemeChange("Basic")}
        >
          <div className="relative">
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center text-6xl">
              2
            </div>
            {selectedTheme === "Basic" && <Ribbon />}
          </div>
          <span>Basic</span>
        </div>
        {themes.map(
          (theme) =>
            theme.owned && (
              <div
                key={theme.uuid}
                className="flex flex-col gap-2 items-center justify-center"
                onClick={() => handleThemeChange(theme)}
              >
                <div className="relative">
                  <img src={theme[2].sm} alt={theme.title} className="w-32" />
                  {selectedTheme !== "Basic" &&
                    selectedTheme.title === theme.title && <Ribbon />}
                </div>
                <span>{theme.title}</span>
              </div>
            )
        )}
      </motion.div>
    </div>
  );
};
