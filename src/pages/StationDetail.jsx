import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, } from "@trussworks/react-uswds";
import EventView from "../components/EventView";
import EventForm from "../components/EventForm";
import { getLocationTz, generateTzDateTime } from "../utils/dateTimeHelpers";
import { put } from "../utils/requestMethods";
import { EventType } from "../utils/listLookup";
import { useGetCruiseById, useGetStationById, useUpdateStation } from "../hooks/useCruises";

const StationDetailPage = () => {
  const { cruiseId, stationId } = useParams();
  const { data: cruise, } = useGetCruiseById(cruiseId);
  const {
    data: station,
    isLoading: stationLoading,
    isError: stationError,
    error: errorStation
  } = useGetStationById(stationId);
  const { mutateAsync: updateStation } = useUpdateStation();
  const [activeAction, setActiveAction] = useState(null);
  const inputFocus = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
    setActiveAction(null)
  }, []);

  if (stationLoading) return <div>Loading Station Data...</div>;
  if (stationError) return <div>Error Loading Station Data: {errorStation?.message}</div>;

  const { cruiseName, } = cruise;
  const { id, stationName, events, catch: catches } = station;
  const { beginSet, endSet, beginHaul, endHaul } = events;

  const handleNavCruisesDetail = (cruiseId) => {
    navigate(`/cruises/${cruiseId}`);
  };

  const handleNewEvent = (eventType) => {
    const stationNewEvent = structuredClone(station);
    stationNewEvent.events[eventType] = {};
    setStation(stationNewEvent);
    setActiveAction(eventType);
  }

  const handleCancelEvent = (eventType) => {
    const eventObj = station.events[eventType];
    if (Object.keys(eventObj).length === 0) {
      const stationCancelEvent = structuredClone(station);
      stationCancelEvent.events[eventType] = null;
      setStation(stationCancelEvent);
    }
    setActiveAction(null);
  }

  const handleSaveEvent = (eventType) => {
    return async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const values = {};

      for (const [key, value] of formData.entries()) {
        values[key] = value;
      }

      const timezone = getLocationTz(values.latitude, values.longitude);
      const eventDateTime = generateTzDateTime(values.eventDate, values.eventTime, timezone);
      const stationUpdates = structuredClone(station);
      const newEventValues = {
        timestamp: eventDateTime,
        latitude: values.latitude,
        longitude: values.longitude,
        windSpeedKnots: values.windSpeed,
        waveHeightMeters: values.waveHeight,
        visibilityKm: values.visibility,
        precipitationId: values.precipitationId,
        comments: values.comments
      };
      stationUpdates.events[eventType] = newEventValues;

      try {
        debugger;
        await updateStation({ cruiseId, stationId: id, updates: stationUpdates })
        setActiveAction(null);
      } catch (error) {
        console.error("Failed to update station: ", error);
      }
    }
  };

  return (
    <>
      {/* Station Header */}
      <Grid row className="margin-top-2">
        <Button className="margin-right-0" onClick={() => handleNavCruisesDetail(cruiseId)} >&lt; Cruise: {cruiseName || ""}</Button>
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Station: {stationName.toUpperCase()}</h1>
      </Grid>
      {/* Begin Set Event */}
      <Grid row className="flex-justify">
        <h1 className="app-sec-header">Event: Begin Set</h1>
        {
          activeAction === EventType.BEGIN_SET
            ? <Button
              className="margin-right-0"
              onClick={() => handleCancelEvent(EventType.BEGIN_SET)}
              secondary
            >
              Cancel Edit Begin Set
            </Button>
            : <Button
              className="margin-right-0"
              onClick={() => setActiveAction(EventType.BEGIN_SET)}
              disabled={activeAction !== null && activeAction !== EventType.BEGIN_SET}
            >
              Edit Begin Set
            </Button>
        }
      </Grid>
      <div className="border padding-1 margin-y-2 radius-lg app-card">
        {activeAction === EventType.BEGIN_SET
          ?
          <EventForm
            event={beginSet}
            eventType={EventType.BEGIN_SET}
            handleSaveEvent={
              handleSaveEvent(EventType.BEGIN_SET)} /> :
          <EventView event={beginSet} />
        }
      </div>
      {/* End Set Event */}
      {
        endSet
          ? <>
            <Grid row className="flex-justify">
              <h1 className="app-sec-header">Event: End Set</h1>
              {
                activeAction === EventType.END_SET
                  ? <Button
                    className="margin-right-0"
                    onClick={() => handleCancelEvent(EventType.END_SET)}
                    secondary
                  >
                    Cancel Edit End Set
                  </Button>
                  : <Button
                    className="margin-right-0"
                    onClick={() => setActiveAction(EventType.END_SET)}
                    disabled={activeAction !== null && activeAction !== EventType.END_SET}
                  >
                    Edit End Set
                  </Button>
              }
            </Grid>
            <div className="border padding-1 margin-y-2 radius-lg app-card">
              {activeAction === EventType.END_SET
                ?
                <EventForm
                  event={endSet}
                  eventType={EventType.END_SET}
                  handleSaveEvent={
                    handleSaveEvent(EventType.END_SET)} />
                :
                <EventView event={endSet} />
              }
            </div>
          </>
          : <>
            <Grid row className="flex-justify margin-bottom-2">
              <h1 className="app-sec-header">Event: End Set</h1>
              <Button
                className="margin-right-0"
                onClick={() => handleNewEvent(EventType.END_SET)}
                disabled={activeAction !== null}
              >Add End Set</Button>
            </Grid>
          </>
      }
      {/* Begin Haul Event */}
      {
        beginHaul
          ? <>
            <Grid row className="flex-justify">
              <h1 className="app-sec-header">Event: Begin Haul</h1>
              {
                activeAction === EventType.BEGIN_HAUL
                  ? <Button
                    className="margin-right-0"
                    onClick={() => handleCancelEvent(EventType.BEGIN_HAUL)}
                    secondary
                  >
                    Cancel Edit Begin Haul
                  </Button>
                  : <Button
                    className="margin-right-0"
                    onClick={() => setActiveAction(EventType.BEGIN_HAUL)}
                    disabled={activeAction !== null && activeAction !== EventType.BEGIN_HAUL}
                  >
                    Edit Begin Haul
                  </Button>
              }
            </Grid>
            <div className="border padding-1 margin-y-2 radius-lg app-card">
              {activeAction === EventType.BEGIN_HAUL
                ?
                <EventForm
                  event={beginHaul}
                  eventType={EventType.BEGIN_HAUL}
                  handleSaveEvent={
                    handleSaveEvent(EventType.BEGIN_HAUL)} />
                :
                <EventView event={beginHaul} />
              }
            </div>
          </>
          : <>
            <Grid row className="flex-justify margin-bottom-2">
              <h1 className="app-sec-header">Event: Begin Haul</h1>
              <Button
                className="margin-right-0"
                onClick={() => handleNewEvent(EventType.BEGIN_HAUL)}
                disabled={activeAction !== null}
              >Add Begin Haul</Button>
            </Grid>
          </>
      }
      {/* End Haul Event */}
      {
        endHaul
          ? <>
            <Grid row className="flex-justify">
              <h1 className="app-sec-header">Event: End Haul</h1>
              {
                activeAction === EventType.END_HAUL
                  ? <Button
                    className="margin-right-0"
                    onClick={() => handleCancelEvent(EventType.END_HAUL)}
                    secondary
                  >
                    Cancel Edit End Haul
                  </Button>
                  : <Button
                    className="margin-right-0"
                    onClick={() => setActiveAction(EventType.END_HAUL)}
                    disabled={activeAction !== null && activeAction !== EventType.END_HAUL}
                  >
                    Edit End Haul
                  </Button>
              }
            </Grid>
            <div className="border padding-1 margin-y-2 radius-lg app-card">
              {activeAction === EventType.END_HAUL
                ?
                <EventForm
                  event={endHaul}
                  eventType={EventType.END_HAUL}
                  handleSaveEvent={
                    handleSaveEvent(EventType.END_HAUL)} />
                :
                <EventView event={endHaul} />
              }
            </div>
          </>
          : <>
            <Grid row className="flex-justify">
              <h1 className="app-sec-header">Event: End Haul</h1>
              <Button
                className="margin-right-0"
                onClick={() => handleNewEvent(EventType.END_HAUL)}
                disabled={activeAction !== null}
              >Add End Haul</Button>
            </Grid>
          </>
      }
    </>
  );
};

export default StationDetailPage;
