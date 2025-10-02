import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./i18n";
import { RouterProvider } from "react-router";
import { router } from "./routes";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <MantineProvider>
        <RouterProvider router={router} />;
      </MantineProvider>
    </StrictMode>
  );
}
