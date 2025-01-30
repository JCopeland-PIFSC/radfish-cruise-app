import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, GridContainer, Grid, Alert } from "@trussworks/react-uswds";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { useAuth } from "../context";
import { useListTablesContext, useCruisesAndStationsContext } from "../context";
import { AppCard } from "../components";

const AppInitStatusPage = () => {
  const { isOffline } = useOfflineStatus();
  const { user } = useAuth();

  // For list tables
  const {
    loading: listsLoading,
    error: listsError,
    listsReady,
  } = useListTablesContext();

  // For cruises & stations
  const {
    loading: cruisesLoading,
    error: cruisesError,
    warning: cruisesWarning,
  } = useCruisesAndStationsContext();

  const navigate = useNavigate();
  const location = useLocation();
  const { additionalWarning } = location.state || {};

  const getListTablesStatus = () => {
    if (listsError) {
      return {
        type: "error",
        heading: "List Tables Initialized",
        message: `List tables initialization failed: ${
          listsError || "Unknown error"
        }`,
      };
    } else if (listsLoading) {
      return {
        type: "info",
        heading: "List Tables Initialized",
        message: "Initializing list tables...",
      };
    } else if (listsReady) {
      return {
        type: "success",
        heading: "List Tables Initialized",
        message: "List tables are ready.",
      };
    } else {
      return {
        type: "warning",
        heading: "List Tables Initialized",
        message: "List tables still not ready...",
      };
    }
  };

  const getCruisesStatus = () => {
    if (cruisesError) {
      return {
        type: "error",
        heading: "Cruises & Stations Loaded",
        message: "Failed to load cruises and stations data.",
      };
    } else if (cruisesLoading) {
      return {
        type: "info",
        heading: "Cruises & Stations Loaded",
        message: "Still loading cruises and stations data...",
      };
    } else {
      if (cruisesWarning) {
        return {
          type: "warning",
          heading: "Cruises & Stations Loaded",
          message: cruisesWarning,
        };
      }
      return {
        type: "success",
        heading: "Cruises & Stations Loaded",
        message: "Cruises & stations data are ready.",
      };
    }
  };

  const statuses = useMemo(() => {
    return {
      "Network Status": {
        type: isOffline ? "error" : "success",
        heading: "Network Status",
        message: isOffline ? "You are offline" : "Online",
      },
      "List Tables Initialized": getListTablesStatus(),
      "Cruises & Stations Loaded": getCruisesStatus(),
    };
  }, [
    isOffline,
    listsError,
    listsLoading,
    listsReady,
    cruisesError,
    cruisesLoading,
    cruisesWarning,
  ]);

  const allStatusesPass = Object.values(statuses).every(
    (s) => s.type === "success",
  );

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

      {/* Additional Warnings (from location.state) */}
      {additionalWarning && (
        <Grid row>
          <Grid col={12}>
            <Alert type="warning" heading="Warning status" headingLevel="h4">
              {additionalWarning}
            </Alert>
          </Grid>
        </Grid>
      )}

      {cruisesWarning && (
        <Grid row>
          <Grid col={12}>
            <Alert type="warning" heading="Warning status" headingLevel="h4">
              {cruisesWarning}
            </Alert>
          </Grid>
        </Grid>
      )}

      <Grid row>
        <Grid col={12}>
          {Object.entries(statuses).map(
            ([statusKey, { type, heading, message }]) => (
              <Alert
                key={statusKey}
                type={type}
                heading={heading}
                headingLevel="h4"
              >
                {message}
              </Alert>
            ),
          )}
        </Grid>
      </Grid>

      <Grid row className="margin-top-6">
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
