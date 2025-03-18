import { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { Images } from "../assets/images";

// Create a context to track loaded images
type ImageLoadContextType = {
  loadedImages: Record<string, boolean>;
  imageCache: Record<string, HTMLImageElement>;
  loading: boolean;
  loadedCount: number;
  totalImages: number;
};

export const ImageLoadContext = createContext<ImageLoadContextType>({
  loadedImages: {},
  imageCache: {},
  loading: true,
  loadedCount: 0,
  totalImages: 0,
});

export const ImageLoadProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const totalImages = useMemo(() => Object.keys(Images).length, []);
  const loadedCount = useRef<number>(0);
  const [imageCache, setImageCache] = useState<Record<string, HTMLImageElement>>({});

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
  }, [totalImages]);

  return (
    <ImageLoadContext.Provider 
      value={{ 
        loadedImages, 
        imageCache, 
        loading, 
        loadedCount: loadedCount.current, 
        totalImages 
      }}
    >
      {children}
    </ImageLoadContext.Provider>
  );
};

export const useImageLoad = () => {
  const context = useContext(ImageLoadContext);
  if (!context) {
    throw new Error("useImageLoad must be used within an ImageLoadProvider");
  }
  return context;
}; 