import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages";
import { PATH } from "../../const";
import { ProfilePage } from "./pages/Profile";

export const GamePage = () => {
  return (
    <Routes>
      <Route path={PATH.HOME} element={<MainPage />} />
      <Route path={PATH.PROFILE} element={<ProfilePage />} />
    </Routes>
  );
};
