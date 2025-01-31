import { Grid } from "@trussworks/react-uswds";
import { listValueLookup } from "../utils/listLookup";
import DescriptionListItem from "./DescriptionListItem";
import { useListTablesContext } from "../context";

const CatchSummary = ({ catchItem }) => {
  const { lists } = useListTablesContext();
  const { species } = lists;
  const { speciesId, aggregateWeightKg } = catchItem;

  return (
    <Grid row>
      <Grid col={12} tablet={{ col: true }}>
        <DescriptionListItem
          term="Species:"
          description={listValueLookup(species, speciesId)}
          descriptionClassName="cruise-details__description"
        />
      </Grid>
      <Grid col={12} tablet={{ col: true }}>
        <DescriptionListItem term="Weight:" description={aggregateWeightKg} descriptionClassName="cruise-details__description" />
      </Grid>
    </Grid>
  );
};

export default CatchSummary;
