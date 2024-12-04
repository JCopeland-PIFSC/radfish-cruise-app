import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";

const AppInitStatusPage = ({ statuses, listsLoading, listsError, listsErrorMessage }) => {
  const navigate = useNavigate();

  // Determine if all statuses are "green"
  const allStatusesPass =
    !listsLoading &&
    !listsError &&
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
  const handleCruisesRedirect = () => {
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
            {Object.entries(statuses).map(([statusName, statusValue]) => (
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
            onClick={handleCruisesRedirect}
          >
            {allStatusesPass ? "Go to Cruises" : "Statuses Incomplete"}
          </Button>
        </Grid>
      </Grid>
    </GridContainer>
  );
};

export default AppInitStatusPage;
