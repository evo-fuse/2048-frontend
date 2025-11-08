import { Route, Routes } from "react-router-dom";
import { PATH } from "../../const";
import {
  WalletDashboardPage,
  SeedPhraseCreationPage,
  SeedPhraseConfirmPage,
  ImportExistingWalletPage,
  SetPasswordPage,
} from "./pages";
import { WalletCreationProvider } from "./context";
export const WalletPage = () => {
  return (
    <WalletCreationProvider>
      <Routes>
        <Route path={PATH.HOME} element={<WalletDashboardPage />} />
        <Route
          path={PATH.IMPORT_EXIST_WALLET}
          element={<ImportExistingWalletPage />}
        />
        <Route path={PATH.SEED_CREATION} element={<SeedPhraseCreationPage />} />
        <Route path={PATH.SEED_CONFIRM} element={<SeedPhraseConfirmPage />} />
        <Route path={PATH.SET_PASSWORD} element={<SetPasswordPage />} />
      </Routes>
    </WalletCreationProvider>
  );
};
