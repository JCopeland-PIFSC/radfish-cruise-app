import "../index.css";
import React, { useContext, useState } from "react";
import {
  Button,
  Grid,
  Fieldset,
  Tag,
} from "@trussworks/react-uswds";
import { StationSummary } from "../components/StationSummary";
import { StationNew } from "../components/StationNew";
import { CruiseContext } from "../CruiseContext";
import { DescriptionListItem } from "../components/DescriptionListItem";
import { useNavigate } from "react-router-dom";
import { listValueLookup } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";
import { generateTzDateTime, getLocationTz } from "../utils/dateTimeHelpers";
import { post } from "../utils/requestMethods";

const API_BASE_URL = "http://localhost:5000";

function CruiseDetailPage({ data }) {
  const { cruise, stations: initialStations } = data;
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
  const navigate = useNavigate();
  const { state } = useContext(CruiseContext);
  const { ports, cruiseStatuses } = state;
  const [enterNewStation, setEnterNewStation] = useState(false);
  const cruiseStatus = listValueLookup(cruiseStatuses, cruiseStatusId);
  const departurePort = listValueLookup(ports, departurePortId);
  const returnPort = listValueLookup(ports, returnPortId);
  const [stations, setStations] = useState(initialStations);

  const handleNavCruisesList = () => {
    navigate("/cruises");
  };

  const handleEnterNewStation = () => {
    setEnterNewStation(!enterNewStation);
  };

  const newStationButton = (statusId, newStationToggle) => {
    if (statusId.toString() === "3" || statusId.toString() === "5") {
      return <Button disabled>New Station</Button>
    }
    return newStationToggle
      ? <Button onClick={handleEnterNewStation} secondary>Cancel New Station</Button>
      : <Button onClick={handleEnterNewStation}>New Station</Button>
  }

  const handleNewStation = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const values = { cruiseId: id };

    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    const timezone = getLocationTz(values.latitude, values.longitude);
    const beginSetDateTime = generateTzDateTime(values.beginSetDate, values.beginSetTime, timezone);
    const newValues = structuredClone(InitializedStation);
    newValues.cruiseId = values.cruiseId;
    newValues.stationName = values.stationName;
    newValues.events.beginSet.timestamp = beginSetDateTime;
    newValues.events.beginSet.latitude = values.latitude;
    newValues.events.beginSet.longitude = values.longitude;
    newValues.events.beginSet.weatherConditions.windSpeedKnots = values.windSpeed;
    newValues.events.beginSet.weatherConditions.waveHeightMeters = values.waveHeight;
    newValues.events.beginSet.weatherConditions.visibilityKm = values.visibility;
    newValues.events.beginSet.weatherConditions.precipitationId = values.precipitationId;
    newValues.events.beginSet.comments = values.comments;

    // process date time
    const newStation = await post(`${API_BASE_URL}/stations`, newValues);
    event.target.reset();
    setEnterNewStation(!enterNewStation);
    setStations([newStation, ...stations]);
  }

  return (
    <>
      <Grid row className="margin-top-2">
        <Button className="margin-right-0" onClick={handleNavCruisesList}>&lt; Cruise List</Button>
      </Grid>
      <Grid row className="flex-justify">
        <h1 className="app-sec-header">Cruise Details</h1>
        <div className="margin-top-2">
          <Tag className={`usa-tag--big ${setStatusColor(cruiseStatusId)}`}>{cruiseStatus}</Tag>
        </div>
      </Grid>
      <div className="border radius-lg padding-1 padding-bottom-0 margin-bottom-2 app-box-shadow">
        <Grid row>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Cruise Name:" description={cruiseName} />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Vessel Name:" description={vesselName} />
          </Grid>
        </Grid>
        <Grid row className="margin-top-2">
          <Grid col={12} tablet={{ col: true }}>
            <Fieldset legend="Departure" className="app-legend-bold-text">
              <DescriptionListItem term="Date:" description={startDate} />
              <DescriptionListItem term="Port:" description={departurePort} />
            </Fieldset>
          </Grid>
          <Grid col>
            <Fieldset legend="Return" className="app-legend-bold-text">
              <DescriptionListItem term="Date:" description={endDate} />
              <DescriptionListItem term="Port:" description={returnPort} />
            </Fieldset>
          </Grid>
        </Grid>
        <Grid row className="flex-justify margin-bottom-1">
          <h2 className="app-sec-header">Stations</h2>
          {newStationButton(cruiseStatusId, enterNewStation)}
        </Grid>
        {enterNewStation && <StationNew handleNewStation={handleNewStation} />}
        {stations.length
          ? stations.map((station) => (
            <StationSummary key={station.id} station={station} />
          ))
          : ""}
      </div>
    </>
  );
}

export default CruiseDetailPage;

const InitializedStation = {
  cruiseId: null,
  stationName: null,
  events: {
    beginSet: {
      timestamp: null,
      latitude: null,
      longitude: null,
      weatherConditions: {
        windSpeedKnots: null,
        waveHeightMeters: null,
        visibilityKm: null,
        precipitationId: null,
      },
      comments: null
    },
  }
}