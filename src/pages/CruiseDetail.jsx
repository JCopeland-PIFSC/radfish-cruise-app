import "../index.css";
import React, { useContext, useState } from "react";
import {
  Button,
  Grid,
  Fieldset,
  Tag,
  Form,
  Label,
  TextInput,
  DatePicker,
  Select
} from "@trussworks/react-uswds";
import { StationSummary } from "../components/StationSummary";
import { StationNew } from "../components/StationNew";
import { CruiseContext } from "../CruiseContext";
import { DescriptionListItem } from "../components/DescriptionListItem";
import { useNavigate } from "react-router-dom";
import { listValueLookup, CruiseStatus } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";
import { generateTzDateTime, getLocationTz } from "../utils/dateTimeHelpers";
import { post, put } from "../utils/requestMethods";

const API_BASE_URL = "http://localhost:5000";

function CruiseDetailPage({ data }) {
  const { cruise: initialCruise, stations: initialStations } = data;
  const [cruise, setCruise] = useState(initialCruise);
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
  const [newStationToggle, setNewStationToggle] = useState(false);
  const [editCruiseToggle, setEditCruiseToggle] = useState(false);
  const cruiseStatus = listValueLookup(cruiseStatuses, cruiseStatusId);
  const departurePort = listValueLookup(ports, departurePortId);
  const returnPort = listValueLookup(ports, returnPortId);
  const [stations, setStations] = useState(initialStations);
  const cruiseStatusIdStr = cruiseStatusId.toString();
  const handleNavCruisesList = () => {
    navigate("/cruises");
  };

  const handleEnterNewStation = () => {
    setNewStationToggle(!newStationToggle);
  };

  const handleEditCruise = () => {
    setEditCruiseToggle(!editCruiseToggle);
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

    const updatedCruise = await put(`${API_BASE_URL}/cruises/${id}`, values);
    setEditCruiseToggle(!editCruiseToggle);
    setCruise(updatedCruise);
  };

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
    setNewStationToggle(!newStationToggle);
    setStations([newStation, ...stations]);
  }

  return (
    <>
      <Grid row className="margin-top-2">
        <Button className="margin-right-0" onClick={handleNavCruisesList}>&lt; Cruise List</Button>
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Cruise Details</h1>
        <div className="margin-top-05">
          <Tag className={`padding-1 usa-tag--big ${setStatusColor(cruiseStatusId)}`}>{cruiseStatus}</Tag>
        </div>
        <Button
          disabled={cruiseStatusIdStr === CruiseStatus.SUBMITTED || cruiseStatusIdStr === CruiseStatus.ACCEPTED || newStationToggle}
          onClick={cruiseStatusIdStr !== CruiseStatus.SUBMITTED && cruiseStatusIdStr !== CruiseStatus.ACCEPTED ? handleEditCruise : undefined}
          secondary={editCruiseToggle}
          className="margin-right-0"
        >
          {cruiseStatusIdStr === CruiseStatus.SUBMITTED || cruiseStatusIdStr === CruiseStatus.ACCEPTED ? "Edit Cruise" : editCruiseToggle ? "Cancel Edit Cruise" : "Edit Cruise"}
        </Button>
      </Grid>
      <div className="border radius-lg padding-1 margin-y-2 app-card">
        {editCruiseToggle
          ?
          <Form className="maxw-full" onSubmit={handleSaveCruise}>
            <Grid row gap>
              <Grid col={12} tablet={{ col: true }}>
                <Label htmlFor="cruise-name" className="text-bold margin-top-1" requiredMarker>
                  Cruise Name:
                </Label>
                <TextInput id="cruise-name" name="cruiseName" defaultValue={cruiseName} required />
              </Grid>
              <Grid col={12} tablet={{ col: true }}>
                <Label htmlFor="vessel-name" className="text-bold margin-top-1" requiredMarker>
                  Vessel Name:
                </Label>
                <TextInput id="vessel-name" name="vesselName" defaultValue={vesselName} required />
              </Grid>
            </Grid>
            <Grid row gap className="margin-top-2">
              <Grid col={12} tablet={{ col: true }}>
                <Fieldset legend="Departure" className="app-legend-bold-text">
                  <Label htmlFor="start-date" className="text-bold margin-top-1" requiredMarker>
                    Date:
                  </Label>
                  <DatePicker id="start-date" name="startDate" defaultValue={startDate} required />
                  <Label htmlFor="departure-port-select" className="text-bold margin-top-1" requiredMarker>
                    Port:
                  </Label>
                  <Select
                    id="departure-port-select"
                    name="departurePortId"
                    defaultValue={departurePortId}
                    required
                  >
                    <option value={null}>- Select Port -</option>
                    {ports.map((port) => (
                      <option key={port.id} value={port.id}>
                        {port.name}
                      </option>
                    ))}
                  </Select>
                </Fieldset>
              </Grid>
              <Grid col>
                <Fieldset legend="Return" className="app-legend-bold-text">
                  <Label htmlFor="end-date" className="text-bold margin-top-1" >
                    Date:
                  </Label>
                  <DatePicker id="end-date" name="endDate" defaultValue={endDate} />
                  <Label htmlFor="return-port-select" className="text-bold margin-top-1" >
                    Port:
                  </Label>
                  <Select
                    id="return-port-select"
                    name="returnPortId"
                    defaultValue={returnPortId}
                  >
                    <option value={null}>- Select Port -</option>
                    {ports.map((port) => (
                      <option key={port.id} value={port.id}>
                        {port.name}
                      </option>
                    ))}
                  </Select>
                </Fieldset>
              </Grid>
            </Grid>
            <Grid row className="flex-column flex-align-end">
              <Button type="submit" >Save Cruise</Button>
            </Grid>
          </Form>
          : <>
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
          </>
        }
      </div>
      <Grid row className="flex-justify margin-bottom-1">
        <h2 className="app-sec-header">Stations</h2>
        <Button
          disabled={cruiseStatusIdStr === CruiseStatus.SUBMITTED || cruiseStatusIdStr === CruiseStatus.ACCEPTED || editCruiseToggle}
          onClick={cruiseStatusIdStr !== CruiseStatus.SUBMITTED && cruiseStatusIdStr !== CruiseStatus.ACCEPTED ? handleEnterNewStation : undefined}
          secondary={newStationToggle}
          className="margin-right-0"
        >
          {cruiseStatusIdStr === CruiseStatus.SUBMITTED || cruiseStatusIdStr === CruiseStatus.ACCEPTED ? "New Station" : newStationToggle ? "Cancel New Station" : "New Station"}
        </Button>
      </Grid>
      {newStationToggle && <StationNew handleNewStation={handleNewStation} />}
      {stations.length
        ? stations.map((station) => (
          <StationSummary key={station.id} station={station} />
        ))
        : ""}
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