import React, { useContext } from "react";
import { Grid, Button } from "@trussworks/react-uswds";
import { listValueLookup } from "../utils/listLookup";
import DescriptionListItem from "./DescriptionListItem";
import { useListTablesContext } from "../context";

const EventView = ({ event }) => {
  if (!event) event = {};
  const {
    timestamp,
    latitude,
    longitude,
    windSpeedKnots,
    waveHeightMeters,
    visibilityKm,
    precipitationId,
    comments,
  } = event;

  const { lists } = useListTablesContext();
  const { precipitation } = lists;

  return (
    <Grid row>
      <Grid col={12}>
        <Grid row>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem term="DateTime:" description={timestamp} descriptionClassName="cruise-details-header"/>
          </Grid>
          <Grid col={12} tablet={{ col: true }} />
        </Grid>
        <hr className="hr-2" />
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Latitude:"
              description={latitude}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Longitude:"
              description={longitude}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Wind Speed:"
              description={windSpeedKnots}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Wave Height:"
              description={waveHeightMeters}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Visibility:"
              description={visibilityKm}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Precipitation:"
              description={listValueLookup(
                precipitation,
                precipitationId,
                "description",
              )}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
        </Grid>
        <Grid row>
          <Grid col={12} tablet={{ col: true }}>
            <DescriptionListItem
              term="Comments:"
              description={comments}
              descriptionClassName="cruise-details-description"
            />
          </Grid>
          <Grid col={12} tablet={{ col: true }} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EventView;
