import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.scss";
import { RecoilRoot } from "recoil";
import { ToastProvider } from "@/components/ui/toast.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <RecoilRoot>
        <ToastProvider>
          <App />
        </ToastProvider>
      </RecoilRoot>
    </Router>
  </StrictMode>
);
