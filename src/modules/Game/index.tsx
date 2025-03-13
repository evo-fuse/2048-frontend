import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages";
import { PATH } from "../../const";

export const GamePage = () => {
  return (
    <Routes>
      <Route path={PATH.HOME} element={<MainPage />} />
    </Routes>
  );
};
