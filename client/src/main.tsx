import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createTheme,
  MantineProvider,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter } from "react-router";
import "./i18n";

import { SocketProvider } from "@/contexts/SocketContext";
import { App } from "./App";

const rootElement = document.getElementById("root");

const theme = createTheme({ primaryColor: "gray" });

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
        </BrowserRouter>
      </MantineProvider>
    </StrictMode>
  );
}
