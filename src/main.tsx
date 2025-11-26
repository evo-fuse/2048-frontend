import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  Web3Provider,
  AuthProvider,
  RecordProvider,
  NotificationProvider,
} from "./context";

createRoot(document.getElementById("root")!).render(
  <RecordProvider>
    <AuthProvider>
      <NotificationProvider>
        <Web3Provider>
          <App />
        </Web3Provider>
      </NotificationProvider>
    </AuthProvider>
  </RecordProvider>
);
