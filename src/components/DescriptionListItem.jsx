import React from "react";
import { Grid } from "@trussworks/react-uswds";

const DescriptionListItem = ({
  term,
  description,
  dtCol = "4",
  ddCol = "8",
  className = "",
  children,
}) => {
  return (
    <Grid row>
      <dl className={`app-desc-list ${className}`}>
        <dt className={`grid-col-${dtCol}`}>{term}</dt>
        {children}
        <dd className={`grid-col-${ddCol}`}>{description}</dd>
      </dl>
    </Grid>
  );
};

export default DescriptionListItem;
