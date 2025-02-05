import "../index.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Grid, GridContainer, Tag } from "@trussworks/react-uswds";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import {
  StationSummary,
  StationNew,
  HeaderWithEdit,
  CruiseView,
  CruiseForm,
  AppCard,
  Spinner,
  GoBackButton,
} from "../components";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { CruiseStatus, listValueLookup } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";
import { generateTzDateTime, getLocationTz } from "../utils/dateTimeHelpers";
import { useListTablesContext, useCruisesAndStationsContext } from "../context";
import { useAuth } from "../context/AuthContext";
import { post } from "../utils/requestMethods";

const CruiseAction = {
  NEW: "NEW",
  EDIT: "EDIT",
};

const InitializedStation = {
  cruiseId: null,
  stationName: null,
  events: {
    beginSet: {
      timestamp: null,
      latitude: null,
      longitude: null,
      windSpeedKnots: null,
      waveHeightMeters: null,
      visibilityKm: null,
      precipitationId: null,
      comments: null,
    },
  },
};

function canSubmit(user, cruise, stations) {
  if (!user) {
    return false;
  }

  if (
    cruise.cruiseStatusId === CruiseStatus.SUBMITTED ||
    cruise.cruiseStatusId === CruiseStatus.ACCEPTED
  ) {
    return false;
  }

  const startDate = new Date(cruise.startDate);
  const endDate = new Date(cruise.endDate);

  return endDate > startDate;
}

const CruiseDetailPage = () => {
  const { cruiseId } = useParams();
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const {
    loading: listsLoading,
    error: listsError,
    lists,
  } = useListTablesContext();
  const { ports, cruiseStatuses } = lists;
  const {
    loading: cruisesLoading,
    error: cruisesError,
    refreshCruisesState,
    refreshStationsState,
    getCruiseById,
    getStationsByCruiseId,
    updateCruise,
    addStation,
    useCruiseStatusLock,
  } = useCruisesAndStationsContext();
  const navigate = useNavigate();
  const location = useLocation();
  const stationRefs = useRef({});
  const [activeAction, setActiveAction] = useState(null);
  const { isStatusLocked } = useCruiseStatusLock(cruiseId);
  useEffect(() => {
    if (location.state?.scrollToStation) {
      const stationId = location.state.scrollToStation;
      const element = stationRefs.current[stationId]?.current;
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  if (listsLoading) return <Spinner message="Loading List Data" fillViewport />;
  if (listsError)
    return <div>Error Loading List Data: {listsError.message}</div>;

  if (cruisesLoading) return <Spinner message="Loading Cruises" fillViewport />;
  if (cruisesError)
    return <div>Error Loading Cruise Data: {cruisesError.message}</div>;

  const cruiseStations = getStationsByCruiseId(cruiseId);

  cruiseStations.forEach((station) => {
    stationRefs.current[station.id] =
      stationRefs.current[station.id] || React.createRef();
  });

  const cruise = getCruiseById(cruiseId);

  if (!cruise) return <div>Cruise Not Found</div>;
  const {
    id,
    cruiseName,
    cruiseStatusId,
    vesselName,
    startDate,
    endDate,
    departurePortId,
    returnPortId,
    uuid,
  } = cruise;
  const cruiseStatus = listValueLookup(cruiseStatuses, cruiseStatusId);

  const handleSaveCruise = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = {
      id,
      cruiseName,
      cruiseStatusId,
      vesselName,
      startDate,
      endDate,
      departurePortId,
      returnPortId,
      uuid: uuid || crypto.randomUUID(),
    };

    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    try {
      await updateCruise(id, values);
      event.target.reset();
      refreshCruisesState(user.id);
      setActiveAction(null);
    } catch (error) {
      console.error("Failed to update cruise: ", error);
    }
  };

  const handleNewStation = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const values = { id: crypto.randomUUID(), cruiseId: id };

    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    const timezone = getLocationTz(values.latitude, values.longitude);
    const beginSetDateTime = generateTzDateTime(
      values.eventDate,
      values.eventTime,
      timezone,
    );
    const newStation = structuredClone(InitializedStation);
    newStation.id = values.id;
    newStation.cruiseId = values.cruiseId;
    newStation.stationName = values.stationName;
    const newBeginSetValues = {
      timestamp: beginSetDateTime,
      latitude: values.latitude,
      longitude: values.longitude,
      windSpeedKnots: values.windSpeed,
      waveHeightMeters: values.waveHeight,
      visibilityKm: values.visibility,
      precipitationId: values.precipitationId,
      comments: values.comments,
    };
    newStation.events.beginSet = newBeginSetValues;

    // process date time
    try {
      await addStation(newStation);
      event.target.reset();
      refreshStationsState(user.id);
      setActiveAction(null);
    } catch (error) {
      console.error("Failed to add new Station: ", error);
    }
  };

  const handleCruiseSubmit = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    try {
      const payload = {
        data: {
          cruise: cruise,
          stations: cruiseStations,
          user: user,
        },
      };

      const data = await post(
        `${import.meta.env.VITE_API_HOST}/api/cruises`,
        payload,
      );

      await updateCruise(cruise.id, data.cruise);
      await refreshCruisesState(user.id);
      console.debug("Cruise submitted successfully:", data);

      navigate("/cruises");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GridContainer className="usa-section">
      <Grid row className="margin-top-2">
        <GoBackButton to="/cruises" label="Cruise List" />
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <div className="">
          <h1 className="app-sec-header">
            Cruise Details
            <Tag
              className={`margin-left-1 radius-md usa-tag--big ${setStatusColor(cruiseStatusId)}`}
            >
              {cruiseStatus}
            </Tag>
          </h1>
        </div>
        <div className="flex">
          {!isStatusLocked && (
            <Button
              disabled={isOffline || !canSubmit(user, cruise, cruiseStations)}
              onClick={handleCruiseSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      </Grid>
      <AppCard className="position-relative margin-bottom-6">
        <HeaderWithEdit
          title=""
          editLabel={"Cruise"}
          actionCheck={CruiseAction.EDIT}
          activeAction={activeAction}
          handleSetAction={() => setActiveAction(CruiseAction.EDIT)}
          handleCancelAction={() => setActiveAction(null)}
          statusLock={isStatusLocked}
        />
        {activeAction !== null && activeAction === CruiseAction.EDIT ? (
          <CruiseForm
            cruise={cruise}
            ports={ports}
            handleSaveCruise={handleSaveCruise}
          />
        ) : (
          <CruiseView cruise={cruise} ports={ports} />
        )}
      </AppCard>
      <Grid row className="flex-justify margin-bottom-1 gap-10">
        <h2 className="app-sec-header">Stations</h2>
        {activeAction === CruiseAction.NEW ? (
          <Button
            className="margin-right-0"
            onClick={() => setActiveAction(null)}
            secondary
          >
            Cancel New Station
          </Button>
        ) : (
          <Button
            className="margin-right-0"
            onClick={() => setActiveAction(CruiseAction.NEW)}
            disabled={
              (activeAction !== null && activeAction !== CruiseAction.NEW) ||
              isStatusLocked
            }
          >
            New Station
          </Button>
        )}
      </Grid>
      {activeAction === CruiseAction.NEW && (
        <StationNew handleNewStation={handleNewStation} />
      )}
      {cruiseStations?.length
        ? cruiseStations.map((station) => (
            <StationSummary
              key={station.id}
              stationRef={stationRefs.current[station.id]}
              cruiseId={id}
              station={station}
              activeAction={activeAction}
            />
          ))
        : ""}
    </GridContainer>
  );
};

export default CruiseDetailPage;
