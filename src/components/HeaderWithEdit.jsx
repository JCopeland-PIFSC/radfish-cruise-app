import { Grid, Button } from "@trussworks/react-uswds";
import { camelStrToTitle } from "../utils/stringUtilities";

const HeaderWithEdit = ({
  title,
  eventType,
  activeAction,
  handleSetAction,
  handleCancelAction
}) => {
  const eventLabel = camelStrToTitle(eventType)

  return (
    <Grid row className="flex-justify margin-bottom-1">
      <h1 className="app-sec-header">{title}</h1>
      {activeAction === eventType
        ?
        <Button
          className="margin-right-0"
          onClick={handleCancelAction}
          secondary
        >
          Cancel Edit
        </Button>
        :
        <Button
          className="margin-right-0"
          onClick={handleSetAction}
          disabled={activeAction !== null && activeAction !== eventType}
        >
          Edit {eventLabel}
        </Button>
      }
    </Grid>
  );
}

export default HeaderWithEdit;