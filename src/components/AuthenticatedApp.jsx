import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useInitializeAndCacheListTables } from "../hooks/useInitializeAndCacheListTables";
import { useLoadCruisesAndStations } from "../hooks/useLoadCruisesAndStations";
import { useAuth } from "../context/AuthContext";
import { useStatus } from "../context/StatusContext";
import Spinner from "./Spinner";

const AuthenticatedApp = () => {
  const { user, userLoading } = useAuth();
  const { setStatusData } = useStatus();

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
    const status = {
      statuses,
      listsLoading,
      isListsError,
      listsErrorMessage,
      cruisesWarning,
    };
    setStatusData(status);
  }, [
    isListsError,
    cruisesError,
    navigate,
    statuses,
    listsLoading,
    listsErrorMessage,
    cruisesWarning,
    setStatusData,
  ]);

  if (userLoading) {
    return <Spinner />;
  }

  if ((!user || !user.isAuthenticated) && !isOffline) {
    return <Navigate to="/switch-accounts" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticatedApp;
