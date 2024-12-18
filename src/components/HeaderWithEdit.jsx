import { Grid, Button } from "@trussworks/react-uswds";

const HeaderWithEdit = ({
  title,
  editLabel,
  actionCheck,
  activeAction,
  handleSetAction,
  handleCancelAction,
  statusLock = false
}) => {
  return (
    <Grid row className="flex-justify margin-bottom-1">
      <h1 className="app-sec-header">{title}</h1>
      {activeAction === actionCheck
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
          disabled={activeAction !== null && activeAction !== actionCheck || statusLock === true}
        >
          Edit {editLabel}
        </Button>
      }
    </Grid>
  );
}

export default HeaderWithEdit;