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
          <DescriptionListItem
            term="Station Name:"
            description={stationName}
            descriptionClassName="cruise-details__header"
          />
        </Grid>
        <Grid col={12} tablet={{ col: true }} />
      </Grid>
      <hr className="hr-2" />
      <Grid row>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Latitude:"
            description={latitude}
            descriptionClassName="cruise-details__description"
          />
          <DescriptionListItem
            term="Longitude:"
            description={longitude}
            descriptionClassName="cruise-details__description"
          />
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <DescriptionListItem
            term="Begin Set:"
            description={displayTzDateTime(events?.beginSet?.timestamp)}
            descriptionClassName="cruise-details__description"
          />
          <DescriptionListItem
            term="End Set:"
            description={displayTzDateTime(events?.endSet?.timestamp)}
            descriptionClassName="cruise-details__description"
          />
          <DescriptionListItem
            term="Begin Haul:"
            description={displayTzDateTime(events?.beginHaul?.timestamp)}
            descriptionClassName="cruise-details__description"
          />
          <DescriptionListItem
            term="End Haul:"
            description={displayTzDateTime(events?.endHaul?.timestamp)}
            descriptionClassName="cruise-details__description"
          />
          <DescriptionListItem
            term="Soak Time:"
            description={getSoakTime(
              events?.endSet?.timestamp,
              events?.beginHaul?.timestamp,
            )}
            descriptionClassName="cruise-details__description"
          />
        </Grid>
      </Grid>
      <hr />
      <Grid row>
        <Grid row className="width-full">
          <h2>Catch Summary</h2>
        </Grid>
        <Grid col>
          {catchList?.length ? (
            catchList.map((catchItem, idx) => (
              <CatchSummary key={idx} catchItem={catchItem} />
            ))
          ) : (
            <div className="cruise-details__description">
              No Catches Reported
            </div>
          )}
        </Grid>
      </Grid>
      <Grid row className="margin-top-2">
        <Button
          disabled={activeAction !== null}
          className="margin-right-0"
          onClick={handleNavEditStation(cruiseId, id)}
        >
          Station Details
        </Button>
      </Grid>
    </AppCard>
  );
};

export default StationSummary;
