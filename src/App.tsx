import "@fontsource/patrick-hand";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ControllerPage, HomePage, SettingPage, StepOnePage } from "./pages";
import { PATH } from "./const";
import { CustomCursor } from "./components";
// Define the electronAPI interface
declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => Promise<void>;
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
