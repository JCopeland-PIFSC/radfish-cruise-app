import { Grid } from "@trussworks/react-uswds";

const DescriptionListItem = ({
  term,
  description,
  className = "",
}) => {
  return (
    <Grid row className={`app-desc-list grid-row ${className}`}>
      <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
        <dt>{term}</dt>
      </Grid>
      <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
        <dd>{description}</dd>
      </Grid>
    </Grid>
  );
};

export default DescriptionListItem;
