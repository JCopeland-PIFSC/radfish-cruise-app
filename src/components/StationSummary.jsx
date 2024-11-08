import React from "react";
import { Grid } from "@trussworks/react-uswds";
import { CatchSummary } from "./CatchSummary";
import { getSoakTime, displayTzDateTime } from "../utils/dateTimeHelpers";
import { DescriptionListItem } from "./DescriptionListItem";

export const StationSummary = ({ station }) => {
  const { stationName, events, catch: catchList } = station;
  const { latitude, longitude } = events.beginSet;

  return (
    <div className="border padding-1 margin-y-2 radius-lg app-card">
      <Grid row>
        <Grid col={true} tablet={{ col: 6 }}>
          <DescriptionListItem term="Station Name:" description={stationName} />
        </Grid>
      </Grid>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Latitude:" description={latitude} />
          <DescriptionListItem term="Longitude:" description={longitude} />
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Begin Set:"
            description={displayTzDateTime(events?.beginSet?.timestamp)}
          />
          <DescriptionListItem
            term="End Set:"
            description={displayTzDateTime(events?.endSet?.timestamp)}
          />
          <DescriptionListItem
            term="Begin Haul:"
            description={displayTzDateTime(events?.beginHaul?.timestamp)}
          />
          <DescriptionListItem
            term="End Haul:"
            description={displayTzDateTime(events?.endHaul?.timestamp)}
          />
          <DescriptionListItem
            term="Soak Time:"
            description={getSoakTime(
              events?.endSet?.timestamp,
              events?.beginHaul?.timestamp,
            )}
          />
        </Grid>
      </Grid>
      <Grid row>
        <Grid row className="width-full">
          <h3 className="app-sec-header">Catch Summary</h3>
        </Grid>
        <Grid col>
          <div className="border padding-1 radius-md app-card">
            {catchList && catchList.length
              ? catchList.map((catchItem, idx) => (
                <CatchSummary key={idx} catchItem={catchItem} />
              ))
              : ""}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
