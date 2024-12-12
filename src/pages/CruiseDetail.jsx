import "../index.css";
import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Grid,
  Tag,
} from "@trussworks/react-uswds";
import StationSummary from "../components/StationSummary";
import StationNew from "../components/StationNew";
import HeaderWithEdit from "../components/HeaderWithEdit";
import CruiseView from "../components/CruiseView";
import CruiseForm from "../components/CruiseForm";
import AppCard from "../components/AppCard";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { listValueLookup } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";
import { generateTzDateTime, getLocationTz } from "../utils/dateTimeHelpers";
import { usePortsList, useCruiseStatusesList } from "../hooks/useListTables";
import { useGetCruiseById, useGetStationsByCruiseId, useUpdateCruise, useAddStation } from "../hooks/useCruises";

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

const CruiseDetailPage = () => {
  const { cruiseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stationRefs = useRef({});
  const {
    data: ports,
    isError: portsError,
    error: errorPorts } = usePortsList();
  const {
    data: cruiseStatuses,
    isError: cruiseStatusesError,
    error: errorCruiseStatuses } = useCruiseStatusesList();
  const {
    data: cruise,
    isLoading: cruiseLoading,
    isError: cruiseError,
    error: errorCruise
  } = useGetCruiseById(cruiseId);
  const {
    data: stations,
    isLoading: stationsLoading,
    isError: stationsError,
    error: errorStations
  } = useGetStationsByCruiseId(cruiseId);

  const [activeAction, setActiveAction] = useState(null);
  const { mutateAsync: updateCruise } = useUpdateCruise();
  const { mutateAsync: addStation } = useAddStation();

  useEffect(() => {
    if (location.state?.scrollToStation) {
      const stationId = location.state.scrollToStation;
      const element = stationRefs.current[stationId]?.current;
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location])

  if (cruiseLoading || stationsLoading) return <div>Loading Cruise Data...</div>;
  if (portsError || cruiseStatusesError) return <div>Error Loading List Data: {portsError ? errorPorts.message : errorCruiseStatuses.message}</div>;
  if (cruiseError) return <div>Error Loading Cruise Data: {errorCruise.message}</div>;

  stations.forEach((station) => {
    stationRefs.current[station.id] = stationRefs.current[station.id] || React.createRef();
  });

  const {
    id,
    cruiseName,
    cruiseStatusId,
    vesselName,
    startDate,
    endDate,
    departurePortId,
    returnPortId,
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
      returnPortId
    };

    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    try {
      await updateCruise({ cruiseId: id, updates: values });
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
      await addStation({ cruiseId: newStation.cruiseId, newStation });
      event.target.reset();
      setActiveAction(null);
    } catch (error) {
      console.error("Failed to add new Station: ", error);
    }
  };

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
          handleCancelAction={() => setActiveAction(null)} />
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
              disabled={activeAction !== null && activeAction !== CruiseAction.NEW}
            >
              New Station
            </Button>
        }
      </Grid>
      {activeAction === CruiseAction.NEW && <StationNew handleNewStation={handleNewStation} />}
      {stations.length
        ? stations.map((station) => (
          <StationSummary
            key={station.id}
            stationRef={stationRefs.current[station.id]}
            cruiseId={id}
            station={station}
            activeAction={activeAction} />
        ))
        : ""}
    </>
  );
}

export default CruiseDetailPage;
