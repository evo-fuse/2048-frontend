import "@fontsource/patrick-hand";
import "@fontsource/cinzel-decorative";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage, GamePage, WalletPage } from "./modules";
import { PATH } from "./const";
import { CustomCursor } from "./components";
import {
  ImageLoadProvider,
} from "./context";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

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

// Main application content
const AppContent = () => {
  useEffect(() => {
    window.electron.clearCache();
  }, []);

  return (
    <>
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path={PATH.HOME} element={<LandingPage />} />
          <Route
            path={PATH.GAME + PATH.ASTERISK}
            element={<GamePage />}
          />
          <Route
            path={PATH.WALLET_CREATION + PATH.ASTERISK}
            element={<WalletPage />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        autoClose={4500}
        theme="dark"
        position="bottom-right"
        icon={false}
        toastStyle={{
          backgroundColor: "#00000066",
          color: "#fff",
          cursor: "none",
          width: "360px",
        }}
        closeOnClick
      />
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
