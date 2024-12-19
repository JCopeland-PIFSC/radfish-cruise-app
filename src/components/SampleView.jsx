import { Grid } from "@trussworks/react-uswds";
import DescriptionListItem from "./DescriptionListItem";

const SampleView = ({ sampleName = "", lengthCm = "", sampleType = "", notes = "" }) => {
  return (
    <>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Sample Name:" description={sampleName} />
        </Grid>
        <Grid col={12} tablet={{ col: true }} />
      </Grid>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Length in cm:" description={lengthCm} />
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Sample Type:" description={sampleType} />
        </Grid>
      </Grid>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Sample Notes:" description={notes} />
        </Grid>
        <Grid col={12} tablet={{ col: true }} />
      </Grid>
    </>)
};

export default SampleView;