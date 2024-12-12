import { Grid, Fieldset } from "@trussworks/react-uswds";
import DescriptionListItem from "./DescriptionListItem";
import { listValueLookup } from "../utils/listLookup";

const CruiseView = ({ cruise, ports }) => {
  const { cruiseName,
    vesselName,
    startDate,
    endDate,
    departurePortId,
    returnPortId } = cruise;

  const departurePort = listValueLookup(ports, departurePortId);
  const returnPort = listValueLookup(ports, returnPortId);

  return (
    <>
      <Grid row gap>
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
  );
}

export default CruiseView;
