import { Grid } from "@trussworks/react-uswds";
import { listValueLookup } from "../utils/listLookup";
import DescriptionListItem from "./DescriptionListItem";
import { useSpeciesList } from "../hooks/useListTables";

const CatchSummary = ({ catchItem }) => {
  const { speciesId, aggregateWeightKg } = catchItem;
  const {
    data: species,
    isError: speciesError,
    error } = useSpeciesList();

  if (speciesError) {
    return <div>Error loading Species: {error.message}</div>;
  }

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
