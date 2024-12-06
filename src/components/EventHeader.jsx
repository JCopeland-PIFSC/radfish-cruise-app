import { Grid, Button } from "@trussworks/react-uswds";
import { camelToTitleCase } from "../utils/stringUtilities";

const EventHeader = ({ eventType, activeAction, handleSetAction, handleCancelEvent }) => {
  const eventLabel = camelToTitleCase(eventType)

  return (
    <Grid row className="flex-justify">
      <h1 className="app-sec-header">Event: {eventLabel}</h1>
      {activeAction === eventType
        ?
        <Button
          className="margin-right-0"
          onClick={() => handleCancelEvent(eventType)}
          secondary
        >
          Cancel Edit
        </Button>
        :
        <Button
          className="margin-right-0"
          onClick={() => handleSetAction(eventType)}
          disabled={activeAction !== null && activeAction !== eventType}
        >
          Edit {eventLabel}
        </Button>
      }
    </Grid>
  );
}

export default EventHeader;