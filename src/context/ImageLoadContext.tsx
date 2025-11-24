import { createContext, useContext, useState, useEffect, useMemo } from "react";
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
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [imageCache, setImageCache] = useState<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    let isMounted = true;
    setLoadedCount(0);
    setLoading(true);
    setLoadedImages({});
    setImageCache({});

    const handleComplete = (key: string, succeeded: boolean, img?: HTMLImageElement) => {
      if (!isMounted) {
        return;
      }

      setLoadedCount((prev) => {
        const newCount = prev + 1;

        if (newCount === totalImages) {
          setLoading(false);
        }

        return newCount;
      });

      setLoadedImages((prev) => ({ ...prev, [key]: succeeded }));

      if (img) {
        setImageCache((prev) => ({ ...prev, [key]: img }));
      }
    };

    Object.entries(Images).forEach(([key, src]) => {
      const img = new Image();

      img.onload = () => handleComplete(key, true, img);
      img.onerror = () => {
        console.error(`Failed to load image: ${key}`);
        handleComplete(key, false);
      };

      img.src = src;
    });

    return () => {
      isMounted = false;
    };
  }, [totalImages]);

  return (
    <ImageLoadContext.Provider
      value={{
        loadedImages,
        imageCache,
        loading,
        loadedCount,
        totalImages,
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