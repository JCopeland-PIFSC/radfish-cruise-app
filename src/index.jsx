import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import App from "./App";
import { Application } from "@nmfs-radfish/radfish";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./db/store.js";
import { tablesMetadataSeed as seed } from "./db/seeds.js";
import { initMetadataTable } from "./utils/databaseHelpers.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

const app = new Application({
  serviceWorker: {
    url:
      import.meta.env.MODE === "development"
        ? "/mockServiceWorker.js" // Deprecate the use of mockServiceWorker. Improve docs on the use of json-server.
        : "/service-worker.js",
  },
  mocks: {
    handlers: import("../mocks/browser.js"),
  },
  storage: store,
});

app.on("ready", async () => {
  const { db } = app?.storage;
  // Initialize MetadataTable if new
  await initMetadataTable(seed);

  // Change debugTable to target table name string "cruises"
  // to enable DB debugging of create and update events.
  const debugTable = "users";
  // Dexie debugging create and update events
  if (import.meta.env.MODE === "development" && db && debugTable) {
    db.table(debugTable).hook("creating", (primKey, obj, transaction) => {
      console.log(`Local ${debugTable} Create: ${JSON.stringify(obj)}`);
    });

    db.table(debugTable).hook(
      "updating",
      (updates, primKey, obj, transaction) => {
        console.log(`Local ${debugTable} Update: ${JSON.stringify(updates)}`);
      },
    );
  }

  const queryClient = new QueryClient();

  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App application={app} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
