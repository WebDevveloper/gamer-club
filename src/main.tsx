// src/main.tsx
import { HeroUIProvider } from "@heroui/react";             // Глобальные настройки темы и стилей :contentReference[oaicite:2]{index=2}
import { ToastProvider } from "@heroui/toast";              // Провайдер тостов :contentReference[oaicite:3]{index=3}
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
      {/* ToastProvider монтируется отдельно, без детей */}
      <ToastProvider
        placement="top-right"
        maxVisibleToasts={3}
        toastOffset={0}
        disableAnimation={false}
        toastProps={{}}
        regionProps={{}}
      />
    </BrowserRouter>
  </React.StrictMode>
);
