import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, } from "@trussworks/react-uswds";
import {
  EventView,
  EventForm,
  HeaderWithEdit,
  AppCard,
} from "../components";
import { EventType } from "../utils/listLookup";
import { camelStrToTitle } from "../utils/stringUtilities";
import { getLocationTz, generateTzDateTime } from "../utils/dateTimeHelpers";
import { useAuth, useListTablesContext, useCruisesAndStationsContext } from "../context";

const StationDetailPage = () => {
  const { cruiseId, stationId } = useParams();
  const { user } = useAuth();
  const { loading: listsLoading, error: listsError, lists } = useListTablesContext();
  const { ports, cruiseStatuses } = lists;
  const {
    loading: stationLoading,
    error: stationError,
    refreshStationsState,
    getStationById, getCruiseById, updateStation, useCruiseStatusLock } = useCruisesAndStationsContext();
  const { isStatusLocked } = useCruiseStatusLock(cruiseId);
  const inputFocus = useRef(null);
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState(null);
  const [newEvent, setNewEvent] = useState({ endSet: null, beginHaul: null, endHaul: null });
  const [addEvent, setAddEvent] = useState(null);
  const [showCatchButton, setShowCatchButton] = useState();

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
    setActiveAction(null)
  }, []);

  const cruise = getCruiseById(cruiseId);
  const station = getStationById(stationId);

  useEffect(() => {
    if (station) {
      const { endSet: newEndSet, beginHaul: newBeginHaul, endHaul: newEndHaul } = newEvent;
      const { events, catch: catches } = station;
      const { endSet, beginHaul, endHaul } = events;

      if (!endSet && newEndSet === null) {
        setAddEvent(EventType.END_SET)
      } else if (!beginHaul && newBeginHaul === null) {
        setAddEvent(EventType.BEGIN_HAUL)
      } else if (!endHaul && newEndHaul === null) {
        setAddEvent(EventType.END_HAUL)
      } else {
        setAddEvent(null);
      }
      let buttonLabel = "Add Catches";
      if (catches?.length) buttonLabel = "Edit Catches";
      if (isStatusLocked) buttonLabel = "View Catches";
      setShowCatchButton(buttonLabel);
    }
  }, [station, newEvent, showCatchButton])

  if (stationLoading) return <div>Loading Station Data...</div>;
  if (stationError) return <div>Error Loading Station Data: {errorStation?.message}</div>;

  const { cruiseName, } = cruise;
  const { id, stationName, events, } = station;
  const { beginSet, endSet, beginHaul, endHaul } = events;

  const handleNavCruiseDetail = (cruiseId, stationId) => {
    return () => navigate(`/cruises/${cruiseId}`, {
      state: { scrollToStation: stationId }
    });
  };

  const handleNavCatchDetail = (cruiseId, stationId) => {
    navigate(`/cruises/${cruiseId}/station/${stationId}/catch`);
  }

  const handleNewEvent = (eventType) => {
    setNewEvent({ ...newEvent, [eventType]: {} })
    setActiveAction(eventType);
  }

  const handleCancelEvent = (eventType) => {
    return () => {
      if (!station.events[eventType]) {
        setNewEvent({ ...newEvent, [eventType]: null })
      }
      setActiveAction(null);
    }
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
        refreshStationsState(user.id);
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
        <Button className="margin-right-0" onClick={handleNavCruiseDetail(cruiseId, stationId)} >&lt; Cruise: {cruiseName || ""}</Button>
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Station: {stationName.toUpperCase()}</h1>
      </Grid>
      {/* Begin Set Event */}
      <AppCard>
        <HeaderWithEdit
          title={`Event: ${camelStrToTitle(EventType.BEGIN_SET)}`}
          editLabel={camelStrToTitle(EventType.BEGIN_SET)}
          actionCheck={EventType.BEGIN_SET}
          activeAction={activeAction}
          handleSetAction={() => setActiveAction(EventType.BEGIN_SET)}
          handleCancelAction={handleCancelEvent(EventType.BEGIN_SET)}
          statusLock={isStatusLocked} />
        {activeAction === EventType.BEGIN_SET
          ? <EventForm
            event={beginSet}
            eventType={EventType.BEGIN_SET}
            handleSaveEvent={
              handleSaveEvent(EventType.BEGIN_SET)} />
          : <EventView event={beginSet} />
        }
      </AppCard>
      {/* End Set Event */}
      {
        (endSet || newEvent[EventType.END_SET]) &&
        <AppCard>
          <HeaderWithEdit
            title={`Event: ${camelStrToTitle(EventType.END_SET)}`}
            editLabel={camelStrToTitle(EventType.END_SET)}
            actionCheck={EventType.END_SET}
            activeAction={activeAction}
            handleSetAction={() => setActiveAction(EventType.END_SET)}
            handleCancelAction={handleCancelEvent(EventType.END_SET)}
            statusLock={isStatusLocked} />
          {activeAction === EventType.END_SET
            ? <EventForm
              event={endSet || newEvent[EventType.END_SET]}
              eventType={EventType.END_SET}
              handleSaveEvent={
                handleSaveEvent(EventType.END_SET)} />
            :
            <EventView event={endSet} />
          }
        </AppCard>
      }
      {/* Begin Haul Event */}
      {
        (beginHaul || newEvent[EventType.BEGIN_HAUL]) &&
        <AppCard>
          <HeaderWithEdit
            title={`Event: ${camelStrToTitle(EventType.BEGIN_HAUL)}`}
            editLabel={camelStrToTitle(EventType.BEGIN_HAUL)}
            actionCheck={EventType.BEGIN_HAUL}
            activeAction={activeAction}
            handleSetAction={() => setActiveAction(EventType.BEGIN_HAUL)}
            handleCancelAction={handleCancelEvent(EventType.BEGIN_HAUL)}
            statusLock={isStatusLocked} />
          {activeAction === EventType.BEGIN_HAUL
            ? <EventForm
              event={beginHaul || newEvent[EventType.BEGIN_HAUL]}
              eventType={EventType.BEGIN_HAUL}
              handleSaveEvent={
                handleSaveEvent(EventType.BEGIN_HAUL)} />
            :
            <EventView event={beginHaul} />
          }
        </AppCard>
      }
      {/* End Haul Event */}
      {
        (endHaul || newEvent[EventType.END_HAUL]) &&
        <AppCard>
          <HeaderWithEdit
            title={`Event: ${camelStrToTitle(EventType.END_HAUL)}`}
            editLabel={camelStrToTitle(EventType.END_HAUL)}
            actionCheck={EventType.END_HAUL}
            activeAction={activeAction}
            handleSetAction={() => setActiveAction(EventType.END_HAUL)}
            handleCancelAction={handleCancelEvent(EventType.END_HAUL)}
            statusLock={isStatusLocked} />
          {activeAction === EventType.END_HAUL
            ? <EventForm
              event={endHaul || newEvent[EventType.END_HAUL]}
              eventType={EventType.END_HAUL}
              handleSaveEvent={
                handleSaveEvent(EventType.END_HAUL)} />
            :
            <EventView event={endHaul} />
          }
        </AppCard>
      }
      {addEvent &&
        <Grid row className="flex-justify-end margin-bottom-2">
          <Button
            className="margin-right-0"
            onClick={() => handleNewEvent(addEvent)}
            disabled={activeAction !== null}
          >Add {camelStrToTitle(addEvent)}</Button>
        </Grid>
      }
      {showCatchButton &&
        <Grid row className="flex-justify-end margin-bottom-2">
          <Button
            className="margin-right-0"
            onClick={() => handleNavCatchDetail(cruiseId, stationId)}
            disabled={activeAction !== null}
          >{showCatchButton}
          </Button>
        </Grid>
      }
    </>
  );
};

export default StationDetailPage;
