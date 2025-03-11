import "@fontsource/patrick-hand";
import "@fontsource/cinzel-decorative";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ControllerPage,
  HomePage,
  SettingPage,
  StepOnePage,
  ScreenPage,
  SoundPage,
  IcoPage,
  CreditsPage
} from "./pages";
import { PATH } from "./const";
import { CustomCursor } from "./components";
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

function App() {
  return (
    <>
      <CustomCursor />
      <BrowserRouter>
        <Routes>
          <Route path={PATH.HOME} element={<HomePage />} />
          <Route path={PATH.SETTING} element={<SettingPage />} />
          <Route path={PATH.CONTROLLER} element={<ControllerPage />} />
          <Route path={PATH.STEP_1} element={<StepOnePage />} />
          <Route path={PATH.SCREEN} element={<ScreenPage />} />
          <Route path={PATH.SOUND} element={<SoundPage />} />
          <Route path={PATH.ICO} element={<IcoPage />} />
          <Route path={PATH.CREDITS} element={<CreditsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
