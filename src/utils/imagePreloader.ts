import { ImageTheme } from '../themes/types';

/**
 * Preloads all images for a specific theme
 * @param theme The theme containing images to preload
 * @returns Promise that resolves when all images are loaded
 */
export const preloadThemeImages = (theme: ImageTheme): Promise<void[]> => {
  if (!theme) return Promise.resolve([]);

  // Collect all image URLs from the theme
  const imageUrls: string[] = [];
  
  // Add all tile images (both small and large versions)
  const tileValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
  
  tileValues.forEach(value => {
    const tileImg = theme[value as keyof typeof theme] as { sm: string; lg: string } | undefined;
    if (tileImg) {
      if (tileImg.sm) imageUrls.push(tileImg.sm);
      if (tileImg.lg) imageUrls.push(tileImg.lg);
    }
  });
  
  // Optional higher value tiles
  ['16384', '32768', '65536'].forEach(value => {
    const tileImg = theme[value as keyof typeof theme] as { sm: string; lg: string } | undefined;
    if (tileImg) {
      if (tileImg.sm) imageUrls.push(tileImg.sm);
      if (tileImg.lg) imageUrls.push(tileImg.lg);
    }
  });

  // Preload each image
  const preloadPromises = imageUrls.map(url => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        resolve(); // Resolve anyway to not block other images
      };
      img.src = url;
    });
  });

  return Promise.all(preloadPromises);
};
