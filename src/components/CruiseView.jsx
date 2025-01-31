import { Grid, Fieldset } from "@trussworks/react-uswds";
import DescriptionListItem from "./DescriptionListItem";
import { listValueLookup } from "../utils/listLookup";

const CruiseView = ({ cruise, ports }) => {
  const {
    cruiseName,
    vesselName,
    startDate,
    endDate,
    departurePortId,
    returnPortId,
  } = cruise;

  const departurePort = listValueLookup(ports, departurePortId);
  const returnPort = listValueLookup(ports, returnPortId);

  return (
    <>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Cruise Name:"
            description={cruiseName}
            descriptionClassName="cruise-details__header"
          />
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Vessel Name:"
            description={vesselName}
            descriptionClassName="cruise-details__header"
          />
        </Grid>
      </Grid>
      <hr className="hr-2"/>
      <Grid row className="margin-top-2">
        <Grid col={12} tablet={{ col: true }}>
          <Fieldset legend="Departure" className="app-legend-bold-text">
            <DescriptionListItem
              term="Date:"
              description={startDate}
              descriptionClassName="cruise-details__description"
            />
            <DescriptionListItem
              term="Port:"
              description={departurePort}
              descriptionClassName="cruise-details__description"
            />
          </Fieldset>
        </Grid>
        <Grid col>
          <Fieldset legend="Return" className="app-legend-bold-text">
            <DescriptionListItem
              term="Date:"
              description={endDate}
              descriptionClassName="cruise-details__description"
            />
            <DescriptionListItem
              term="Port:"
              description={returnPort}
              descriptionClassName="cruise-details__description"
            />
          </Fieldset>
        </Grid>
      </Grid>
    </>
  );
};

export default CruiseView;
