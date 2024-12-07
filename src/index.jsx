import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application, IndexedDBMethod } from "@nmfs-radfish/radfish";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
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
  storage: new IndexedDBMethod(
    dbConfig.offlineStorageConfig.name,
    dbConfig.offlineStorageConfig.version,
    dbConfig.offlineStorageConfig.stores,
  )
});


app.on("ready", async () => {
  // Initialize IndexedDB database
  const dbManager = DatabaseManager.getInstance(dbConfig);
  dbManager.initMetadataTable();

  const queryClient = new QueryClient();

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App application={app} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
