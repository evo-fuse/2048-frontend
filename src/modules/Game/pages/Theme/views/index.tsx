import { AnimatePresence, motion } from "framer-motion";
import { useGameContext } from "../../../context";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Theme, TileImg } from "../../../../../types";
import {
  LoadingModal,
  ThemeItem,
  ThemeItemSkeleton,
  CreateThemeButton,
  CreateThemeModal,
  ThemeDetailModal,
} from "../components";
import { ThemeFormData } from "../types";
import { Tabs } from "../../../../../components/Tab";
import { IoListOutline, IoStarOutline, IoGlobeOutline, IoLockClosedOutline } from "react-icons/io5";

export const ThemeView = () => {
  const { themes, selectedTheme, setSelectedTheme, setThemes, getThemes } =
    useGameContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingThemes, setIsFetchingThemes] = useState(true);
  const [activeTab, setActiveTab] = useState("mylist");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  const [hoverTheme, setHoverTheme] = useState<Theme | "Basic" | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedThemeForDetail, setSelectedThemeForDetail] = useState<
    Theme | "Basic" | null
  >(null);

  useEffect(() => {
    setIsFetchingThemes(true);
    getThemes()
      .then((data) => {
        setThemes(data);
      })
      .finally(() => {
        setIsFetchingThemes(false);
      });
  }, []);

  const myThemes = useMemo(() => {
    return themes.filter((theme) => theme.owned);
  }, [themes]);

  const premiumThemes = useMemo(() => {
    return themes.filter((theme) => theme.visibility === "premium");
  }, [themes]);

  const publicThemes = useMemo(() => {
    return themes.filter((theme) => theme.visibility === "public");
  }, [themes]);

  const privateThemes = useMemo(() => {
    return themes.filter((theme) => theme.visibility === "private");
  }, [themes]);

  // Track tab position to determine slide direction
  const tabOrder = ["mylist", "premium", "public", "private"];

  const handleTabChange = useCallback(
    (tab: string) => {
      const currentIndex = tabOrder.indexOf(activeTab);
      const newIndex = tabOrder.indexOf(tab);

      setSlideDirection(newIndex > currentIndex ? "right" : "left");
      setActiveTab(tab);
    },
    [activeTab]
  );

  const handleThemeChange = useCallback((theme: Theme | "Basic") => {
    // Show theme detail modal instead of immediately applying
    setSelectedThemeForDetail(theme);
    setShowDetailModal(true);
  }, []);

  // New function to apply the theme when confirmed in the modal
  const handleApplyTheme = useCallback(
    async (theme: Theme | "Basic") => {
      if (theme === selectedTheme) return;

      setIsLoading(true);

      try {
        // Find the selected theme
        if (theme === "Basic") {
          setSelectedTheme("Basic");
          return;
        }

        if (theme) {
          // Preload all images in the theme
          const imageUrls = [
            2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192,
          ]
            .map((value) => {
              // Check if the tile exists and has a valid sm property
              const tile = theme[value as keyof Theme] as TileImg | undefined;
              return tile && typeof tile === "object" ? tile.sm : null;
            })
            .filter(Boolean); // Remove null/undefined values

          // Preload all images
          await Promise.all(
            imageUrls.map((url) => {
              return new Promise((resolve) => {
                if (!url) {
                  // Skip invalid URLs
                  resolve(null);
                  return;
                }

                const img = new Image();
                img.onload = () => resolve(null);
                img.onerror = () => {
                  console.warn(`Failed to load image: ${url}`);
                  resolve(null); // Resolve anyway to avoid Promise.all rejection
                };
                img.src = url;
              });
            })
          );
        }

        setSelectedTheme(theme);
      } catch (error) {
        console.error("Failed to preload theme images:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTheme, setSelectedTheme]
  );

  // Check if a theme is selected
  const isThemeSelected = useCallback(
    (theme: Theme | "Basic") => {
      if (theme === "Basic") return selectedTheme === "Basic";
      return selectedTheme !== "Basic" && selectedTheme?.title === theme.title;
    },
    [selectedTheme]
  );

  const handleCreateTheme = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedThemeForDetail(null);
  }, []);

  const handleSubmitTheme = useCallback(
    (themeData: ThemeFormData) => {
      console.log("Theme data submitted:", themeData);
      // Here you would call an API to create the theme
      // After successful creation:
      setShowCreateModal(false);
      // Refresh themes
      getThemes().then((data) => {
        setThemes(data);
      });
    },
    [getThemes, setThemes]
  );

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingModal />}</AnimatePresence>
      <CreateThemeModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleSubmitTheme}
      />
      <ThemeDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        theme={selectedThemeForDetail}
        onApplyTheme={handleApplyTheme}
        isSelected={selectedThemeForDetail === selectedTheme}
      />
      <motion.div
        className="flex flex-col items-start justify-start flex-wrap w-full h-full gap-2 text-white"
      >
        {/* Tab Navigation */}
        <Tabs
          tabs={[
            { id: "mylist", label: "My List", icon: IoListOutline },
            { id: "premium", label: "Premium", icon: IoStarOutline },
            { id: "public", label: "Public", icon: IoGlobeOutline },
            { id: "private", label: "Private", icon: IoLockClosedOutline },
          ]}
          selectedTab={activeTab}
          setSelectedTab={handleTabChange}
          className="mb-2 3xs:mb-2.5 xs:mb-3 sm:mb-3.5 md:mb-4 lg:mb-4"
          tabsContainerClassName="text-white overflow-x-auto flex-nowrap"
        />

        {/* Tab Content */}
        <div className="w-full overflow-hidden">
          {isFetchingThemes ? (
            <div className="w-full grid grid-cols-7 items-start justify-start flex-wrap gap-4 pt-4">
              {Array.from({ length: 14 }).map((_, index) => (
                <ThemeItemSkeleton key={index} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{
                  x: slideDirection === "left" ? -50 : 50,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  x: slideDirection === "left" ? 50 : -50,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="w-full grid grid-cols-7 items-start justify-start flex-wrap gap-4 pt-4"
              >
                {activeTab === "mylist" && (
                  <>
                    <CreateThemeButton onClick={handleCreateTheme} />
                    <ThemeItem
                      key="basic"
                      theme="Basic"
                      isSelected={isThemeSelected("Basic")}
                      onClick={() => handleThemeChange("Basic")}
                      onHover={setHoverTheme}
                    />
                    {myThemes.map((theme) => (
                      <ThemeItem
                        key={theme.uuid}
                        theme={theme}
                        isSelected={isThemeSelected(theme)}
                        onClick={() => handleThemeChange(theme)}
                        onHover={setHoverTheme}
                      />
                    ))}
                  </>
                )}
                {activeTab === "premium" && (
                  <>
                    {premiumThemes.map((theme) => (
                      <ThemeItem
                        key={theme.uuid}
                        theme={theme}
                        isSelected={isThemeSelected(theme)}
                        onClick={() => handleThemeChange(theme)}
                        onHover={setHoverTheme}
                      />
                    ))}
                  </>
                )}
                {activeTab === "public" && (
                  <>
                    {publicThemes.map((theme) => (
                      <ThemeItem
                        key={theme.uuid}
                        theme={theme}
                        isSelected={isThemeSelected(theme)}
                        onClick={() => handleThemeChange(theme)}
                        onHover={setHoverTheme}
                      />
                    ))}
                  </>
                )}
                {activeTab === "private" && (
                  <>
                    {privateThemes.map((theme) => (
                      <ThemeItem
                        key={theme.uuid}
                        theme={theme}
                        isSelected={isThemeSelected(theme)}
                        onClick={() => handleThemeChange(theme)}
                        onHover={setHoverTheme}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className="">
          {hoverTheme && hoverTheme !== "Basic" && (
            <div className="w-full bg-black/50 absolute bottom-0 left-0">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-2xl font-bold">
                  {hoverTheme.title}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
