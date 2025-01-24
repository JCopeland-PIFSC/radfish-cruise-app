import "../index.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Grid,
  Tag,
} from "@trussworks/react-uswds";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import {
  StationSummary,
  StationNew,
  HeaderWithEdit,
  CruiseView,
  CruiseForm,
  AppCard,
} from "../components"
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
      comments: null
    },
  }
};

function canSubmit(user, cruise, stations) {
  if (!user || !user.isAuthenticated) {
    return false;
  }

  // Validate cruise data
  const requiredCruiseFields = [
    'id',
    'cruiseName',
    'cruiseStatusId',
    'vesselName',
    'startDate',
    'endDate',
    'departurePortId',
    'returnPortId'
  ];
  for (const field of requiredCruiseFields) {
    if (!cruise[field]) {
      return false;
    }
  }

  // Ensure startDate is before endDate
  const startDate = new Date(cruise.startDate);
  const endDate = new Date(cruise.endDate);
  if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
    return false;
  }

  // Validate stations array
  if (!Array.isArray(stations) || stations.length === 0) {
    return false;
  }

  for (const station of stations) {
    // Check required station fields
    const requiredStationFields = ['id', 'cruiseId', 'stationName'];
    for (const field of requiredStationFields) {
      if (!station[field]) {
        return false;
      }
    }

    // Check if station's cruiseId matches cruise.id
    if (station.cruiseId !== cruise.id) {
      return false;
    }

    // Validate station events
    const requiredEventSets = ['beginSet', 'endSet', 'beginHaul', 'endHaul'];
    for (const setName of requiredEventSets) {
      const eventSet = station.events[setName];
      if (!eventSet) {
        return false;
      }

      // Check required event fields
      const requiredEventFields = ['timestamp', 'latitude', 'longitude'];
      for (const field of requiredEventFields) {
        if (eventSet[field] === null || eventSet[field] === undefined || eventSet[field] === '') {
          return false;
        }
      }
    }
  }

  return true;
}

const CruiseDetailPage = () => {
  const { cruiseId } = useParams();
  const { user } = useAuth();
  const { loading: listsLoading, error: listsError, lists } = useListTablesContext();
  const { isOffline } = useOfflineStatus();
  const { ports, cruiseStatuses } = lists;
  const {
    loading: cruisesLoading,
    error: cruisesError,
    refreshCruisesState,
    refreshStationsState,
    getCruiseById,
    getStationsByCruiseId,
    addCruise,
    addStation,
    updateStation,
    useCruiseStatusLock,
    updateCruise,
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
  }, [location])

  if (listsLoading) return <div>Loading List Data...</div>;
  if (listsError) return <div>Error Loading List Data: {listsError.message}</div>;

  if (cruisesLoading) return <div>Loading Cruise Data...</div>;
  if (cruisesError) return <div>Error Loading Cruise Data: {cruiseError.message}</div>;

  const cruiseStations = getStationsByCruiseId(cruiseId);

  cruiseStations.forEach((station) => {
    stationRefs.current[station.id] = stationRefs.current[station.id] || React.createRef();
  });

  const cruise = getCruiseById(cruiseId);
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

  const handleNavCruisesList = () => {
    navigate("/cruises");
  };


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
      if (values.cruiseStatusId === CruiseStatus.REJECTED) {
        // Duplicate the cruise with new UUIDs and update status
        const newCruise = {
          ...values,
          id: uuidv4(),
          uuid: uuidv4(),
          cruiseStatusId: CruiseStatus.STARTED,
        };

        // Clone all associated stations with new UUIDs and assign to the new cruise
        const newStations = cruiseStations.map(station => ({
          ...station,
          id: uuidv4(),
          cruiseId: newCruise.id,
        }));

        try {
          // Add the new cruise to the user
          await addCruise(user.id, newCruise);

          // Add each cloned station to the backend
          for (const station of newStations) {
            await addStation(station);
          }

          // Refresh the state to include the new cruise and stations
          await refreshCruisesState(user.id);
          await refreshStationsState(user.id);

          // Navigate to the new cruise's detail page
          navigate(`/cruises/${newCruise.id}`);
          return;
        } catch (error) {
          console.error("Failed to duplicate cruise and stations:", error);
          return;
        }
      }

      await updateCruise(id, values);
      event.target.reset();
      await refreshCruisesState(user.id);
      await setActiveAction(null)
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
    const beginSetDateTime = generateTzDateTime(values.eventDate, values.eventTime, timezone);
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
      comments: values.comments
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
  
  const handleCruiseSubmit = useCallback(async (event) => {
    event.preventDefault();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.isAuthenticated);

    if (!user) {
      console.error("No authenticated user found.");
      return;
    }

    try {
      const payload = {
        data: {
          cruise: cruise,
          stations: cruiseStations,
          user: user
        }
      };
      
      const data = await post(`${import.meta.env.VITE_API_HOST}/api/cruises`, payload);

      console.debug("Cruise submitted successfully:", data);

      // Update cruise state with the returned cruise data
      if (data.cruise) {
        await updateCruise(data.cruise.id, data.cruise);
      }

      // Update stations state with the returned stations data
      if (data.stations && Array.isArray(data.stations)) {
        for (const station of data.stations) {
          const { cruiseId, id: stationId, ...updates } = station;
          await updateStation({
            cruiseId,
            stationId,
            updates
          });
        }
      }

      // // Refresh the cruises and stations state to ensure consistency
      // await refreshCruisesState(user.id);
      // await refreshStationsState(user.id);

      navigate("/cruises");
    } catch (err) {
      console.error(err);
    }
  }, [cruise, cruiseStations, navigate, updateCruise, updateStation, refreshCruisesState, refreshStationsState]);

  return (
    <>
      <Grid row className="margin-top-2">
        <Button className="margin-right-0" onClick={handleNavCruisesList}>&lt; Cruise List</Button>
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Cruise Details</h1>
        <div className="margin-top-05 margin-bottom-2 mobile-lg:margin-bottom-0">
          <Tag className={`padding-1 usa-tag--big ${setStatusColor(cruiseStatusId)}`}>{cruiseStatus}</Tag>
        </div>
      </Grid>
      <AppCard>
        <HeaderWithEdit
          title=""
          editLabel={"Cruise"}
          actionCheck={CruiseAction.EDIT}
          activeAction={activeAction}
          handleSetAction={() => setActiveAction(CruiseAction.EDIT)}
          handleCancelAction={() => setActiveAction(null)}
          statusLock={isStatusLocked} />
        {activeAction !== null && activeAction === CruiseAction.EDIT
          ?
          <CruiseForm cruise={cruise} ports={ports} handleSaveCruise={handleSaveCruise} />
          :
          <CruiseView cruise={cruise} ports={ports} />
        }
      </AppCard>
      <Grid row className="flex-justify margin-bottom-1">
        <h2 className="app-sec-header">Stations</h2>
        {
          activeAction === CruiseAction.NEW
            ? <Button
              className="margin-right-0"
              onClick={() => setActiveAction(null)}
              secondary
            >
              Cancel New Station
            </Button>
            : <Button
              className="margin-right-0"
              onClick={() => setActiveAction(CruiseAction.NEW)}
              disabled={activeAction !== null && activeAction !== CruiseAction.NEW || isStatusLocked}
            >
              New Station
            </Button>
        }
      </Grid>
      {activeAction === CruiseAction.NEW && <StationNew handleNewStation={handleNewStation} />}
      {cruiseStations?.length
        ? cruiseStations.map((station) => (
          <StationSummary
            key={station.id}
            stationRef={stationRefs.current[station.id]}
            cruiseId={id}
            station={station}
            activeAction={activeAction} />
        ))
        : ""}
      {!isStatusLocked && (
        <Button
          disabled={isOffline || !canSubmit(user, cruise, cruiseStations)}
          onClick={handleCruiseSubmit}
        >
          Submit
        </Button>
      )}
    </>
  );
}

export default CruiseDetailPage;
