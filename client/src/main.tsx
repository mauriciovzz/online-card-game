import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { createTheme, MantineProvider } from "@mantine/core";
import "./i18n";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";

import { CardsProvider } from "./contexts/CardsContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { App } from "./App";

const theme = createTheme({ primaryColor: "gray" });
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <CardsProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </CardsProvider>
        </BrowserRouter>
      </MantineProvider>
    </StrictMode>,
  );
}
