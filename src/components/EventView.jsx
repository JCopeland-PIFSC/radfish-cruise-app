import React, { useContext } from "react";
import { Grid } from "@trussworks/react-uswds";
import { listValueLookup } from "../utils/listLookup";
import DescriptionListItem from "./DescriptionListItem";

const EventView = ({ event }) => {
  const {
    timestamp,
    latitude,
    longitude,
    windSpeedKnots,
    waveHeightMeters,
    visibilityKm,
    precipitationId,
    comments } = event;

  return (
    <Grid row>
      <Grid col={12}>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="DateTime:"
              description={timestamp}
              dtCol="2" ddCol="10" />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Latitude:" description={latitude} />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Longitude:" description={longitude} />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Wind Speed:" description={windSpeedKnots} />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Wave Height:" description={waveHeightMeters} />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="Visibility:" description={visibilityKm} />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Precipitation:"
              description={listValueLookup(precipitation, precipitationId, "description")} />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} >
            <DescriptionListItem
              term="Comments:"
              description={comments}
              dtCol="2" ddCol="10" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EventView;
