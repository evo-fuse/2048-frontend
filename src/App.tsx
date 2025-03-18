import "@fontsource/patrick-hand";
import "@fontsource/cinzel-decorative";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  HomePage,
  SettingPage,
  IcoPage,
  CreditsPage,
  GamePage,
  WalletPage,
} from "./modules";
import { PATH } from "./const";
import { CustomCursor } from "./components";
import { AuthProvider } from "./context";
import { ImageLoadProvider, useImageLoad } from "./context";

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

// Loading component to show while images are loading
const LoadingScreen = () => {
  const { loadedCount, totalImages } = useImageLoad();
  
  return (
    <div className="w-full h-full flex flex-col items-start justify-end overflow-hidden gap-4">
      <span className="text-3xl font-bold pl-8">Loading...</span>
      <div
        className="border-t border-t-black transition-all pb-8"
        style={{ width: `${(1600 * totalImages) / loadedCount}px` }}
      />
    </div>
  );
};

// Main application content
const AppContent = () => {
  const { loading } = useImageLoad();
  
  return (
    <>
      <CustomCursor />
      {loading ? (
        <LoadingScreen />
      ) : (
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path={PATH.HOME} element={<HomePage />} />
              <Route
                path={PATH.SETTING + PATH.ASTERISK}
                element={<SettingPage />}
              />
              <Route path={PATH.ICO} element={<IcoPage />} />
              <Route path={PATH.CREDITS} element={<CreditsPage />} />
              <Route path={PATH.GAME + PATH.ASTERISK} element={<GamePage />} />
              <Route
                path={PATH.WALLET_CREATION + PATH.ASTERISK}
                element={<WalletPage />}
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      )}
    </>
  );
};

function App() {
  return (
    <ImageLoadProvider>
      <AppContent />
    </ImageLoadProvider>
  );
}

export default App;
