import "../index.css";
import React, { useContext } from "react";
import {
  Title,
  Button,
  Grid,
  Fieldset,
  Tag,
} from "@trussworks/react-uswds";
import { StationSummary } from "../components/StationSummary";
import { CruiseContext } from "../CruiseContext";
import { DescriptionListItem } from "../components/DescriptionListItem";
import { useNavigate } from "react-router-dom";
import { listValueLookup } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";

function CruiseDetailPage({ data }) {
  const { cruise, stations } = data;
  const {
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
  const cruiseStatus = listValueLookup(cruiseStatuses, cruiseStatusId);
  const departurePort = listValueLookup(ports, departurePortId);
  const returnPort = listValueLookup(ports, returnPortId);

  const handleNavCruisesList = () => {
    navigate("/cruises");
  };

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
        <Grid row>
          <h2 className="app-sec-header">Stations</h2>
        </Grid>
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
