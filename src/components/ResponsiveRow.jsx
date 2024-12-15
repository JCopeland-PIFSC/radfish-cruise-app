import { Grid } from "@trussworks/react-uswds";

const ResponsiveRow = ({ children }) => {
  const [leftColLabel, leftColItem, rightColLabel, rightColItem] = children
  return (
    <Grid row gap>
      <Grid col={12} tablet={{ col: true }}>
        <Grid row>
          <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
            {leftColLabel}
          </Grid>
          <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
            {leftColItem}
          </Grid>
        </Grid>
      </Grid>
      <Grid col={12} tablet={{ col: true }}>
        <Grid row>
          <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
            {rightColLabel}
          </Grid>
          <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
            {rightColItem || ""}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ResponsiveRow;