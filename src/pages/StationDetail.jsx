import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, } from "@trussworks/react-uswds";
import EventView from "../components/EventView";
import EventForm from "../components/EventForm";
import { getLocationTz, generateTzDateTime } from "../utils/dateTimeHelpers";
import { put } from "../utils/requestMethods";
import { EventType } from "../utils/listLookup";

const StationDetailPage = ({ data }) => {
  const { cruiseName, station: initialStation } = data;
  const [station, setStation] = useState(initialStation);
  const { id, cruiseId, stationName, events, catch: catches } = station;
  const { beginSet, endSet, beginHaul, endHaul } = events;
  const { state } = useContext(CruiseContext);
  const { precipitation } = state;
  const [resetToggle, setResetToggle] = useState(false);
  const [stationEditToggle, setStationEditToggle] = useState(false);
  const [beginSetEditToggle, setBeginSetEditToggle] = useState(false);
  const [endSetEditToggle, setEndSetEditToggle] = useState(false);
  const [beginHaulEditToggle, setBeginHaulEditToggle] = useState(false);
  const [endHaulEditToggle, setEndHaulEditToggle] = useState(false);

  const inputFocus = useRef(null);
  const navigate = useNavigate();

  const handleNavCruisesDetail = (cruiseId) => {
    return () => navigate(`/cruises/${cruiseId}`);
  };

  const toggleEditBeginSet = () => {
    setBeginSetEditToggle(!beginSetEditToggle)
  };

  const handleSaveEvent = (station, eventName, toggleFn) => {
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
      stationUpdates.events[eventName] = newEventValues;

      const updatedStation = await put(`/api/stations/${station.id}`, stationUpdates);
      setActiveEventEdit(null);
      setStation(updatedStation);
    }
  }

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
    setResetToggle(false);
  }, [resetToggle]);

  return (
    <>
      <Grid row className="margin-top-2">
        <Button className="margin-right-0" onClick={handleNavCruisesDetail(cruiseId)} >&lt; Cruise: {cruiseName}</Button>
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Station: {stationName.toUpperCase()}</h1>
      </Grid>
      <Grid row className="flex-justify">
        <h1 className="app-sec-header">Event: Begin Set</h1>
        <Button
          className="margin-right-0"
          onClick={toggleEditBeginSet}
          secondary={beginSetEditToggle}
        >
          {beginSetEditToggle ? "Cancel Edit Begin Set" : "Edit Begin Set"}
        </Button>
      </Grid>
      <div className="border padding-1 margin-y-2 radius-lg app-card">
        {beginSetEditToggle
          ?
          <Form className="maxw-full" onSubmit={handleSaveEvent(station, "beginSet", () => setBeginSetEditToggle(!beginSetEditToggle))}>
            <Grid row>
              <Grid col={12}>
                <Grid row gap>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="begin-set-date" className="grid-col-4 text-bold margin-top-05" hint=" (MM/DD/YYYY)" requiredMarker>Begin Set Date:</Label>
                      <DatePicker id="begin-set-date" name="eventDate" className="grid-col-8" defaultValue={getTzDateTimeParts(beginSet.timestamp).date} required />
                    </Grid>
                  </Grid>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="begin-set-time" className="grid-col-4 text-bold margin-top-05" hint=" (24hr hh:mm)" requiredMarker>Begin Set Time:</Label>
                      <TextInputMask id="begin-set-time" name="eventTime" type="text" className="grid-col-8" defaultValue={getTzDateTimeParts(beginSet.timestamp).time} aria-labelledby="time" aria-describedby="hint-time" mask="__:__" pattern="([01]\d|2[0-3]):[0-5]\d" />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="latitude" className="grid-col-4 text-bold margin-top-05" hint=" (Decimal Deg)" requiredMarker>Latitude:</Label>
                      <TextInput id="latitude" name="latitude" className="grid-col-8" defaultValue={beginSet.latitude} required />
                    </Grid>
                  </Grid>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="longitude" className="grid-col-4 text-bold margin-top-05" hint=" (Decimal Deg)" requiredMarker>Longitude:</Label>
                      <TextInput id="longitude" name="longitude" className="grid-col-8" defaultValue={beginSet.longitude} required />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="wind-speed" className="grid-col-4 text-bold margin-top-05" hint=" (Knots)" requiredMarker>Wind Speed:</Label>
                      <TextInput id="wind-speed" name="windSpeed" className="grid-col-8" defaultValue={beginSet.windSpeedKnots} required />
                    </Grid>
                  </Grid>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="wave-height" className="grid-col-4 text-bold margin-top-05" hint=" (Meters)" requiredMarker>Wave Height:</Label>
                      <TextInput id="wave-height" name="waveHeight" className="grid-col-8" defaultValue={beginSet.waveHeightMeters} required />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="visibility" className="grid-col-4 text-bold margin-top-2" hint=" (Km)" requiredMarker>Visibility:</Label>
                      <TextInput id="visibility" name="visibility" className="grid-col-8" defaultValue={beginSet.visibilityKm} required />
                    </Grid>
                  </Grid>
                  <Grid col={12} tablet={{ col: true }}>
                    <Grid row>
                      <Label htmlFor="precipitation-select" className="grid-col-4 text-bold margin-top-2" requiredMarker>
                        Precipitation:
                      </Label>
                      <Select
                        id="precipitation-select"
                        name="precipitationId"
                        className="grid-col-8"
                        defaultValue={beginSet.precipitationId}
                        required
                      >
                        <option value={null}>- Select -</option>
                        {precipitation.map((precip) => (
                          <option key={precip.id} value={precip.id}>
                            {precip.description}
                          </option>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid row gap>
                  <Grid col={12} >
                    <Label htmlFor="begin-set-comment" className="text-bold margin-top-2" >Comments:</Label>
                    <Textarea id="begin-set-comment" name="comments" defaultValue={beginSet.comments} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid row className="flex-column flex-align-end">
              <Button type="submit" className="margin-right-0">Save Begin Set</Button>
            </Grid>
          </Form>
          :
          <Grid row>
            <Grid col={12}>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Begin Set Time:" description={beginSet.timestamp} dtCol="2" ddCol="10" />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Latitude:" description={beginSet.latitude} />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Longitude:" description={beginSet.longitude} />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Wind Speed:" description={beginSet.windSpeedKnots} />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Wave Height:" description={beginSet.waveHeightMeters} />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Visibility:" description={beginSet.visibilityKm} />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <DescriptionListItem term="Precipitation:" description={listValueLookup(precipitation, beginSet.precipitationId, "description")} />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} >
                  <DescriptionListItem dtCol="2" ddCol="10" term="Comments:" description={beginSet.comments} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      </div>
    </>
  );
};

export default StationDetailPage;
