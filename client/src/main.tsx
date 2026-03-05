import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./i18n";
import { BrowserRouter } from "react-router";
import { SocketProvider } from "./contexts/SocketContext";
import { App } from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MantineProvider>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
        </BrowserRouter>
      </MantineProvider>
    </StrictMode>
  );
}
