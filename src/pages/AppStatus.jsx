import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useAuth } from "../context";
import { useListTablesContext, useCruisesAndStationsContext } from "../context";

const AppInitStatusPage = () => {
  const { isOffline } = useOfflineStatus();
  const { user } = useAuth();
  const {
    loading: listsLoading,
    error: listsError,
    listsReady,
  } = useListTablesContext();
  const {
    loading: cruisesLoading,
    error: cruisesError,
    warning: cruisesWarning,
  } = useCruisesAndStationsContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { additionalWarning } = location.state || {};

  // Memoize statuses to prevent unnecessary re-renders
  const statuses = useMemo(
    () => ({
      "Network Status": isOffline ? "red" : "green",
      "List Tables Initialized": listsReady ? "green" : "yellow",
      "Cruises & Stations Loaded": cruisesLoading
        ? "yellow"
        : cruisesError
          ? "red"
          : "green",
    }),
    [isOffline, listsReady, , cruisesLoading, cruisesError],
  );

  // Determine if all statuses are "green"
  const allStatusesPass =
    !listsLoading &&
    !listsError &&
    !!statuses &&
    Object.values(statuses).every((status) => status === "green");

  // Status Indicator Helper
  const renderStatusIndicator = (status) => {
    return <span className={`status-indicator ${status}`} />;
  };

  // Navigate to Cruises
  const handleNavCruises = () => {
    if (allStatusesPass) {
      navigate("/cruises");
    }
  };

  return (
    <GridContainer>
      <Grid row>
        <Grid col={12}>
          <h1>Application Status</h1>
        </Grid>
      </Grid>
      {additionalWarning && (
        <Grid row>
          <Grid col={12}>
            <p class="text-error">{additionalWarning}</p>
          </Grid>
        </Grid>
      )}
      {cruisesWarning && (
        <Grid row>
          <Grid col={12}>
            <p>{cruisesWarning}</p>
          </Grid>
        </Grid>
      )}
      <Grid row>
        <Grid col={12}>
          <ul class="usa-list--unstyled padding-left-0">
            {statuses &&
              Object.entries(statuses).map(([statusName, statusValue]) => (
                <li key={statusName} class="margin-bottom-2">
                  {renderStatusIndicator(statusValue)}
                  <strong>{statusName}</strong>
                </li>
              ))}
          </ul>
        </Grid>
      </Grid>
      {listsLoading && (
        <Grid row>
          <Grid col={12}>
            <p>Initializing lists tables...</p>
          </Grid>
        </Grid>
      )}
      {listsError && (
        <Grid row>
          <Grid col={12}>
            <p className="text-error">
              List tables initialization failed: {listsError || "Unknown error"}
            </p>
          </Grid>
        </Grid>
      )}
      <Grid row>
        <Grid col={12}>
          <Button
            type="button"
            disabled={!allStatusesPass}
            onClick={handleNavCruises}
          >
            {allStatusesPass ? "Go to Cruises" : "Statuses Incomplete"}
          </Button>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default AppInitStatusPage;
