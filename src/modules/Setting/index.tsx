import { Route, Routes } from "react-router-dom";
import { PATH } from "../../const";
import { ControllerPage, MainPage, ScreenPage, SoundPage } from "./pages";

export const SettingPage = () => {
  return (
    <Routes>
      <Route path={PATH.HOME} element={<MainPage />} />
      <Route path={PATH.CONTROLLER} element={<ControllerPage />} />
      <Route path={PATH.SCREEN} element={<ScreenPage />} />
      <Route path={PATH.SOUND} element={<SoundPage />} />
    </Routes>
  );
};
