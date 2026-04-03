import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import { waitForServer } from "./init";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles/global.css";

async function start() {
  await waitForServer();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

void start();
