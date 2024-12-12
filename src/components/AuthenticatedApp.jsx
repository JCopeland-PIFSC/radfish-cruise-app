import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useInitializeAndCacheListTables } from "../hooks/useInitializeAndCacheListTables";
import { useLoadCruisesAndStations } from "../hooks/useLoadCruisesAndStations";
import Spinner from "./Spinner";

const AuthenticatedApp = () => {
  // Initialize global data and caches
  const { isOffline } = useOfflineStatus();
  const {
    isReady,
    isLoading: listsLoading,
    isError: isListsError,
    error: listsErrorMessage,
  } = useInitializeAndCacheListTables(isOffline);
  const {
    loading: cruisesLoading,
    warning: cruisesWarning,
    error: cruisesError,
  } = useLoadCruisesAndStations(isReady, isOffline);

  // Statuses for the status page
  const statuses = {
    "Network Status": isOffline ? "red" : "green",
    "List Tables Initialized": isReady ? "green" : "yellow",
    "Cruises & Stations Loaded": cruisesLoading
      ? "yellow"
      : cruisesError
        ? "red"
        : "green",
  };

  if (listsLoading || cruisesLoading) {
    return <Spinner />;
  }

  // Fallback UI for initialization errors (if needed)
  if (isListsError || cruisesError) {
    return (
      <Navigate
        to="/app-init-status"
        replace
        state={{
          statuses,
          listsLoading,
          isListsError,
          listsErrorMessage,
          additonalWarning:
            cruisesWarning &&
            "Cruises or stations are missing. Please connect to the network if you suspect data is incomplete.",
        }}
      />
    );
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticatedApp;
