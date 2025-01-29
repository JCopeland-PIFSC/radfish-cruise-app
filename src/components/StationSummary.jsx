import { useNavigate } from "react-router-dom";
import { Button, Grid } from "@trussworks/react-uswds";
import CatchSummary from "./CatchSummary";
import AppCard from "./AppCard";
import DescriptionListItem from "./DescriptionListItem";
import { getSoakTime, displayTzDateTime } from "../utils/dateTimeHelpers";

const StationSummary = ({ cruiseId, station, activeAction, stationRef }) => {
  const { id, stationName, events, catch: catchList } = station;
  const { latitude, longitude } = events.beginSet;
  const navigate = useNavigate();

  const handleNavEditStation = (cruiseId, stationId) => {
    return () => navigate(`/cruises/${cruiseId}/station/${stationId}`);
  };

  return (
    <AppCard ref={stationRef}>
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem term="Station Name:" description={stationName} />
        </Grid>
        <Grid col={12} tablet={{ col: true }} />
      </Grid>
      <hr/>
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
      <hr/>
      <Grid row>
        <Grid row className="width-full">
          <h3 className="app-sec-header">Catch Summary</h3>
        </Grid>
        <Grid col>
          {catchList?.length
            ? catchList.map((catchItem, idx) => (
              <CatchSummary key={idx} catchItem={catchItem} />
            ))
            : "No Catches Reported"}
        </Grid>
      </Grid>
      <Grid row className="margin-top-2">
        <Button
          disabled={activeAction !== null}
          className="margin-right-0"
          onClick={handleNavEditStation(cruiseId, id)}
        >Station Details
        </Button>
      </Grid>
    </AppCard>
  );
};

export default StationSummary;
