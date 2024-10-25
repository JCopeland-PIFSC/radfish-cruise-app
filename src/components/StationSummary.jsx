import React from "react";
import { Grid, Title } from "@trussworks/react-uswds";
import { CatchSummary } from "./CatchSummary";
import { utcToLocalDateTime, getSoakTime } from "../utils/dateTimeHelpers";
import { DescriptionListItem } from "./DescriptionListItem";

export const StationSummary = ({ station }) => {
  const { stationName, location, events, catch: catchList } = station;
  const { latitude, longitude } = location;
  return (
    <div className="border padding-1 margin-bottom-1 radius-lg app-box-shadow">
      <Grid row>
        <em>{stationName}</em>
      </Grid>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Latitude:" description={latitude} />
          <DescriptionListItem term="Longitude:" description={longitude} />
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Begin Set:"
            description={utcToLocalDateTime(events?.beginSet?.timestamp)}
          />
          <DescriptionListItem
            term="End Set:"
            description={utcToLocalDateTime(events?.endSet?.timestamp)}
          />
          <DescriptionListItem
            term="Begin Haul:"
            description={utcToLocalDateTime(events?.beginHaul?.timestamp)}
          />
          <DescriptionListItem
            term="End Haul:"
            description={utcToLocalDateTime(events?.endHaul?.timestamp)}
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
          <Title>Catch Summary</Title>
        </Grid>
        <Grid col>
          <div className="border padding-1 radius-md app-box-shadow">
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
