import React, { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useInitializeAndCacheListTables } from "../hooks/useInitializeAndCacheListTables";
import { useLoadCruisesAndStations } from "../hooks/useLoadCruisesAndStations";
import Spinner from "./Spinner";

const AuthenticatedApp = () => {
  // Initialize global data and caches
  const { isOffline } = useOfflineStatus();
  const navigate = useNavigate();
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

  // Memoize statuses to prevent unnecessary re-renders
  const statuses = useMemo(
    () => ({
      "Network Status": isOffline ? "red" : "green",
      "List Tables Initialized": isReady ? "green" : "yellow",
      "Cruises & Stations Loaded": cruisesLoading
        ? "yellow"
        : cruisesError
          ? "red"
          : "green",
    }),
    [isOffline, isReady, cruisesLoading, cruisesError],
  );

  // This navigation happens as a side effect in response to the error state.
  // The useEffect hook ensures this logic only runs when an error is detected,
  // preventing unnecessary re-renders or navigation loops.
  useEffect(() => {
    if (isListsError || cruisesError) {
      navigate("/app-init-status", {
        state: {
          statuses,
          listsLoading,
          isListsError,
          listsErrorMessage,
          additionalWarning:
            cruisesWarning &&
            "Cruises or stations are missing. Please connect to the network if you suspect data is incomplete.",
        },
      });
    }
  }, [
    isListsError,
    cruisesError,
    navigate,
    statuses,
    listsLoading,
    listsErrorMessage,
    cruisesWarning,
  ]);

  if (listsLoading || cruisesLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticatedApp;
