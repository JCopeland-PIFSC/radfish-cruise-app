import React, { useContext } from "react";
import { Grid } from "@trussworks/react-uswds";
import { CruiseContext } from "../CruiseContext";
import { listValueLookup } from "../utils/listLookup";
import DescriptionListItem from "./DescriptionListItem";

const CatchSummary = ({ catchItem }) => {
  const { speciesId, aggregateWeightKg } = catchItem;
  const { state } = useContext(CruiseContext);
  const { species } = state;

  return (
    <Grid row>
      <Grid col={12} tablet={{ col: true }}>
        <DescriptionListItem
          term="Species:"
          description={listValueLookup(species, speciesId)}
        />
      </Grid>
      <Grid col={12} tablet={{ col: true }}>
        <DescriptionListItem term="Weight:" description={aggregateWeightKg} />
      </Grid>
    </Grid>
  );
};

export default CatchSummary;
