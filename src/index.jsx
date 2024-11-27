import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application } from "@nmfs-radfish/radfish";
import { OfflineStorageWrapper } from "@nmfs-radfish/react-radfish";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dbConfig from "./db/dbConfig.js";
import DatabaseManager from "./utils/DatabaseManager.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

const app = new Application({
  serviceWorker: {
    url:
      import.meta.env.MODE === "development"
        ? "/mockServiceWorker.js"
        : "/service-worker.js",
  },
  mocks: {
    handlers: import("../mocks/browser.js"),
  },
});


app.on("ready", async () => {
  // Initialize IndexedDB database
  const dbManager = DatabaseManager.getInstance(dbConfig);
  dbManager.initMetadataTable();

  const queryClient = new QueryClient();

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <OfflineStorageWrapper config={dbConfig.offlineStorageConfig}>
          <App />
        </OfflineStorageWrapper>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
