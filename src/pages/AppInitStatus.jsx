import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { useStatus } from "../context/StatusContext";

const AppInitStatusPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { statusData } = useStatus();
  const { additionalWarning } = location.state || {};

  const {
    statuses,
    listsLoading,
    isListsError,
    listsErrorMessage,
    cruisesWarning,
  } = statusData;

  // Determine if all statuses are "green"
  const allStatusesPass =
    !listsLoading &&
    !isListsError &&
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
      {additionalWarning && (
        <Grid row>
          <Grid col={12}>
            <p style={{ color: "red" }}>{additionalWarning}</p>
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
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {statuses && Object.entries(statuses).map(([statusName, statusValue]) => (
              <li key={statusName} style={{ marginBottom: "12px" }}>
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
      {isListsError && (
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
