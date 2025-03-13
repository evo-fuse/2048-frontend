import "@fontsource/patrick-hand";
import "@fontsource/cinzel-decorative";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  HomePage,
  SettingPage,
  IcoPage,
  CreditsPage,
  GamePage,
} from "./modules";
import { PATH } from "./const";
import { CustomCursor } from "./components";
import { useEffect, useState, createContext, useMemo, useRef } from "react";
import { Images } from "./assets/images";

// Define the electronAPI interface

declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => Promise<void>;
      closeApp: () => void;
      toggleFullScreen: () => void;
      getFullScreen: () => Promise<boolean>;
      onEnterFullScreen: (callback: (fullScreenState: boolean) => void) => void;
      onLeaveFullScreen: (callback: (fullScreenState: boolean) => void) => void;
      removeFullScreenListeners: () => void;
    };
  }
}

// Create a context to track loaded images
export const ImageLoadContext = createContext<{
  loadedImages: Record<string, boolean>;
  imageCache: Record<string, HTMLImageElement>;
}>({
  loadedImages: {},
  imageCache: {},
});

function App() {
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const totalImages = useMemo(() => Object.keys(Images).length, []);
  const loadedCount = useRef<number>(0);
  const [imageCache, setImageCache] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    const newImageCache: Record<string, HTMLImageElement> = {};

    // Set a timeout to show content even if images are still loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds max loading time

    Object.entries(Images).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loadedCount.current++;
        newImageCache[key] = img;
        setLoadedImages((prev) => ({ ...prev, [key]: true }));

        if (loadedCount.current === totalImages) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      };

      img.onerror = () => {
        loadedCount.current++;
        console.error(`Failed to load image: ${key}`);
        setLoadedImages((prev) => ({ ...prev, [key]: false }));

        if (loadedCount.current === totalImages) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      };
    });

    setImageCache(newImageCache);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ImageLoadContext.Provider value={{ loadedImages, imageCache }}>
      <CustomCursor />
      {loading ? (
        <div className="w-full h-full flex flex-col items-start justify-end overflow-hidden gap-4">
          <span className="text-3xl font-bold pl-8">Loading...</span>
          <div
            className="border-t border-t-black transition-all pb-8"
            style={{ width: `${(1600 * totalImages) / loadedCount.current}px` }}
          />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path={PATH.HOME} element={<HomePage />} />
            <Route path={PATH.SETTING + PATH.ASTERISK} element={<SettingPage />} />
            <Route path={PATH.ICO} element={<IcoPage />} />
            <Route path={PATH.CREDITS} element={<CreditsPage />} />
            <Route path={PATH.GAME + PATH.ASTERISK} element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ImageLoadContext.Provider>
  );
}

export default App;
