import { Route, Routes } from "react-router-dom";
import { MainPage, ProfilePage, LoadingPage, WalletPage, ShopPage } from "./pages";
import { PATH } from "../../const";
import { GameProvider } from "./context/GameContext";
import { PrivateRoute } from "../../components/PrivateRoute";

export const GamePage = () => {
  return (
    <GameProvider>
      <Routes>
        <Route path={PATH.LOADING} element={<LoadingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path={PATH.HOME} element={<MainPage />} />
          <Route path={PATH.PROFILE} element={<ProfilePage />} />
          <Route path={PATH.WALLET} element={<WalletPage />} />
          <Route path={PATH.SHOP} element={<ShopPage />} />
        </Route>
      </Routes>
    </GameProvider>
  );
};
