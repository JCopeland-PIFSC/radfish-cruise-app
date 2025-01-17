import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { useListTablesContext, useCruisesAndStationsContext } from "../context";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useAuth } from "../context/AuthContext";

const AppInitStatusPage = () => {
  const { state } = useLocation();
  const { isOffline } = useOfflineStatus();
  // const { statuses, listsLoading, listsError, listsErrorMessage, additionalWarning } = state || {};
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listsReady, loading: listsLoading, error: listsError } = useListTablesContext();
  const { loading: cruisesLoading, warning: cruisesWarning, error: cruisesError } = useCruisesAndStationsContext();

  // Memoize statuses to prevent unnecessary re-renders
  const statuses = useMemo(
    () => ({
      "Authenticated User": user?.username ? "green" : "red",
      "Network Status": isOffline ? "red" : "green",
      "List Tables Initialized": listsError ? "red" : listsReady ? "green" : "yellow",
      "Cruises & Stations Loaded": cruisesError ? "red" : cruisesWarning ? "yellow" : cruisesLoading ? "blue" : "green",
    }),
    [user, isOffline, listsReady, cruisesLoading, cruisesError],
  );
  // Determine if all statuses are "green"
  const allStatusesPass =
    !listsLoading &&
    !listsError &&
    !!statuses &&
    Object.values(statuses).every((status) => status === "green");

  // Status Indicator Helper
  const renderStatusIndicator = (status) => {
    const colorMap = {
      green: "green",
      yellow: "yellow",
      red: "red",
      loading: "blue", // Optional: Indicator for loading state
    };

    return (
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: colorMap[status],
          marginRight: "8px",
        }}
      />
    );
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
          <h1>Status Check</h1>
        </Grid>
      </Grid>
      <Grid row>
        <Grid col={12}>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {statuses && Object.entries(statuses).map(([statusName, statusValue]) => (
              <li key={statusName} style={{ marginBottom: "12px" }}>
                {renderStatusIndicator(statusValue)}
                <strong>{statusName}</strong>
                {(statusName === "Authenticated User") && <span style={{ marginLeft: "8px" }}>{user?.username ? user.username : "Invalid User"}</span>}
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
            <p style={{ color: "red" }}>
              List tables initialization failed: {listsErrorMessage || "Unknown error"}
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
