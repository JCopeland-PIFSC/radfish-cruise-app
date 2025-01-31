import { Grid } from "@trussworks/react-uswds";
import DescriptionListItem from "./DescriptionListItem";
import SampleView from "./SampleView";
import { listValueLookup } from "../utils/listLookup";

const CatchView = ({ catchDetails, speciesList, sampleTypesList }) => {
  const { speciesId, aggregateWeightKg, individuals } = catchDetails;

  return (
    <>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Species Name:"
            description={listValueLookup(speciesList, speciesId)}
            descriptionClassName="cruise-details__header"
          />
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Tot Weight Kg:"
            description={aggregateWeightKg}
            descriptionClassName="cruise-details__header"
          />
        </Grid>
      </Grid>
      <hr className="app-hr-heavy" />
      <Grid row>
        <Grid col>
          {individuals?.length
            ? individuals.map((sampleItem, idx) => (
                <div key={idx}>
                  {idx > 0 && <hr className="app-hr-light" />}
                  <SampleView
                    sampleName={sampleItem?.bioSample?.sampleName}
                    lengthCm={sampleItem?.lengthCm}
                    sampleType={listValueLookup(
                      sampleTypesList,
                      sampleItem?.bioSample?.sampleTypeId,
                    )}
                    notes={sampleItem?.bioSample?.notes}
                  />
                </div>
              ))
            : "No Samples Recorded"}
        </Grid>
      </Grid>
    </>
  );
};

export default CatchView;