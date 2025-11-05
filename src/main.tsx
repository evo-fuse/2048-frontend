import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  Web3Provider,
  AuthProvider,
  RecordProvider,
} from "./context";

createRoot(document.getElementById("root")!).render(
  <RecordProvider>
    <AuthProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </AuthProvider>
  </RecordProvider>
);
