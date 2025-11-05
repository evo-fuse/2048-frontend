import "@fontsource/patrick-hand";
import "@fontsource/cinzel-decorative";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage, GamePage, WalletPage } from "./modules";
import { PATH } from "./const";
import { CustomCursor } from "./components";
import {
  ImageLoadProvider,
  useImageLoad,
} from "./context";
import { ToastContainer } from "react-toastify";
import { MdDownload } from "react-icons/md";
import { motion } from "framer-motion";

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
  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gray-950">
      <MdDownload color="white" size={96} className="animate-bounce" />
      <span className="text-white text-2xl font-bold">Preparing Assets...</span>
      <div className="w-96 h-2 bg-white rounded-full mt-4 relative overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gray-500 rounded-full"
          style={{ width: "25%" }}
          initial={{ x: -96 }}
          animate={{ x: 384 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
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
      )}
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
