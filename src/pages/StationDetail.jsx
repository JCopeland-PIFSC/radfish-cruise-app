import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, } from "@trussworks/react-uswds";
import EventView from "../components/EventView";
import EventForm from "../components/EventForm";
import { getLocationTz, generateTzDateTime } from "../utils/dateTimeHelpers";
import { EventType } from "../utils/listLookup";
import { useGetCruiseById, useGetStationById, useUpdateStation } from "../hooks/useCruises";
import EventHeader from "../components/EventHeader";
import { camelToTitleCase } from "../utils/stringUtilities";

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
  const [newEvent, setNewEvent] = useState({ endSet: null, beginHaul: null, endHaul: null });
  const [addEvent, setAddEvent] = useState(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
    setActiveAction(null)
  }, []);

  useEffect(() => {
    if (station) {
      const { endSet: newEndSet, beginHaul: newBeginHaul, endHaul: newEndHaul } = newEvent;
      const { events } = station;
      const { endSet, beginHaul, endHaul } = events;

      if (!endSet && newEndSet === null) {
        setAddEvent(EventType.END_SET)
      } else if (!beginHaul && newBeginHaul === null) {
        setAddEvent(EventType.BEGIN_HAUL)
      } else if (!endHaul && newEndHaul === null) {
        setAddEvent(EventType.END_HAUL)
      } else {
        setAddEvent(null)
      }
    }
  }, [station, newEvent])

  if (stationLoading) return <div>Loading Station Data...</div>;
  if (stationError) return <div>Error Loading Station Data: {errorStation?.message}</div>;

  const { cruiseName, } = cruise;
  const { id, stationName, events, catch: catches } = station;
  const { beginSet, endSet, beginHaul, endHaul } = events;

  const handleNavCruisesDetail = (cruiseId) => {
    navigate(`/cruises/${cruiseId}`);
  };

  const handleNewEvent = (eventType) => {
    setNewEvent({ ...newEvent, [eventType]: {} })
    setActiveAction(eventType);
  }

  const handleCancelEvent = (eventType) => {
    if (!station.events[eventType]) {
      setNewEvent({ ...newEvent, [eventType]: null })
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
      <div className="border padding-1 margin-y-2 radius-lg app-card">
        <EventHeader
          eventType={EventType.BEGIN_SET}
          activeAction={activeAction}
          handleSetAction={setActiveAction}
          handleCancelEvent={handleCancelEvent} />
        {activeAction === EventType.BEGIN_SET
          ? <EventForm
            event={beginSet}
            eventType={EventType.BEGIN_SET}
            handleSaveEvent={
              handleSaveEvent(EventType.BEGIN_SET)} />
          : <EventView event={beginSet} />
        }
      </div>
      {/* End Set Event */}
      {
        (endSet || newEvent[EventType.END_SET]) &&
        <div className="border padding-1 margin-y-2 radius-lg app-card">
          <EventHeader
            eventType={EventType.END_SET}
            activeAction={activeAction}
            handleSetAction={setActiveAction}
            handleCancelEvent={handleCancelEvent} />
          {activeAction === EventType.END_SET
            ? <EventForm
              event={endSet || newEvent[EventType.END_SET]}
              eventType={EventType.END_SET}
              handleSaveEvent={
                handleSaveEvent(EventType.END_SET)} />
            :
            <EventView event={endSet} />
          }
        </div>
      }
      {/* Begin Haul Event */}
      {
        (beginHaul || newEvent[EventType.BEGIN_HAUL]) &&
        <div className="border padding-1 margin-y-2 radius-lg app-card">
          <EventHeader
            eventType={EventType.BEGIN_HAUL}
            activeAction={activeAction}
            handleSetAction={setActiveAction}
            handleCancelEvent={handleCancelEvent} />
          {activeAction === EventType.BEGIN_HAUL
            ? <EventForm
              event={beginHaul || newEvent[EventType.BEGIN_HAUL]}
              eventType={EventType.BEGIN_HAUL}
              handleSaveEvent={
                handleSaveEvent(EventType.BEGIN_HAUL)} />
            :
            <EventView event={beginHaul} />
          }
        </div>
      }
      {/* End Haul Event */}
      {
        (endHaul || newEvent[EventType.END_HAUL]) &&
        <div className="border padding-1 margin-y-2 radius-lg app-card">
          <EventHeader
            eventType={EventType.END_HAUL}
            activeAction={activeAction}
            handleSetAction={setActiveAction}
            handleCancelEvent={handleCancelEvent} />
          {activeAction === EventType.END_HAUL
            ? <EventForm
              event={endHaul || newEvent[EventType.END_HAUL]}
              eventType={EventType.END_HAUL}
              handleSaveEvent={
                handleSaveEvent(EventType.END_HAUL)} />
            :
            <EventView event={endHaul} />
          }
        </div>
      }

      {addEvent &&
        <Grid row className="flex-justify-end margin-bottom-2">
          <Button
            className="margin-right-0"
            onClick={() => handleNewEvent(addEvent)}
            disabled={activeAction !== null}
          >Add {camelToTitleCase(addEvent)}</Button>
        </Grid>
      }
    </>
  );
};

export default StationDetailPage;
