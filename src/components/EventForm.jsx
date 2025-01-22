import {
  Grid,
  Form,
  Label,
  TextInput,
  TextInputMask,
  DatePicker,
  Select,
  Button,
  Textarea
} from "@trussworks/react-uswds";
import ResponsiveRow from "./ResponsiveRow";
import { camelToDash, camelStrToTitle } from "../utils/stringUtilities";
import { getTzDateTimeParts } from "../utils/dateTimeHelpers";
import { useListTablesContext } from "../context";

const EventForm = ({ event, handleSaveEvent, eventType }) => {
  const {
    timestamp,
    latitude,
    longitude,
    windSpeedKnots,
    waveHeightMeters,
    visibilityKm,
    precipitationId,
    comments } = event;
  const { lists } = useListTablesContext();
  const { precipitation } = lists;
  const eventPrefix = camelToDash(eventType);
  const eventLabel = camelStrToTitle(eventType);

  return (
    <>
      <Form id={`${eventPrefix}-form`} name={`${eventType}Form`} className="maxw-full" onSubmit={handleSaveEvent}>
        <Grid row>
          <Grid col={12}>
            <ResponsiveRow>
              <Label htmlFor={`${eventPrefix}-date`} className="text-bold margin-top-2" hint=" (MM/DD/YYYY)" requiredMarker>Date:</Label>
              <DatePicker id={`${eventPrefix}-date`} name="eventDate" defaultValue={timestamp ? getTzDateTimeParts(timestamp).date : ""} required />
              <Label htmlFor={`${eventPrefix}-time`} className="text-bold margin-top-2" hint=" (24hr hh:mm)" requiredMarker>Time:</Label>
              <TextInputMask id={`${eventPrefix}-time`} name="eventTime" type="text" defaultValue={timestamp ? getTzDateTimeParts(timestamp).time : ""} aria-labelledby="time" aria-describedby="hint-time" mask="__:__" pattern="([01]\d|2[0-3]):[0-5]\d" />
            </ResponsiveRow>
            <ResponsiveRow>
              <Label htmlFor={`${eventPrefix}-latitude`} className="text-bold margin-top-2" hint=" (Decimal Deg)" requiredMarker>Latitude:</Label>
              <TextInput id={`${eventPrefix}-latitude`} name="latitude" defaultValue={latitude || ""} required />
              <Label htmlFor={`${eventPrefix}-longitude`} className="text-bold margin-top-2" hint=" (Decimal Deg)" requiredMarker>Longitude:</Label>
              <TextInput id={`${eventPrefix}-longitude`} name="longitude" defaultValue={longitude || ""} required />
            </ResponsiveRow>
            <ResponsiveRow>
              <Label htmlFor={`${eventPrefix}-wind-speed`} className="text-bold margin-top-2" hint=" (Knots)" requiredMarker>Wind Speed:</Label>
              <TextInput id={`${eventPrefix}-wind-speed`} name="windSpeed" defaultValue={windSpeedKnots || ""} required />
              <Label htmlFor={`${eventPrefix}-wave-height`} className="text-bold margin-top-2" hint=" (Meters)" requiredMarker>Wave Height:</Label>
              <TextInput id={`${eventPrefix}-wave-height`} name="waveHeight" defaultValue={waveHeightMeters || ""} required />
            </ResponsiveRow>
            <ResponsiveRow>
              <Label htmlFor={`${eventPrefix}-visibility`} className="text-bold margin-top-2" hint=" (Km)" requiredMarker>Visibility:</Label>
              <TextInput id={`${eventPrefix}-visibility`} name="visibility" defaultValue={visibilityKm || ""} required />
              <Label htmlFor={`${eventPrefix}-precipitation-select`} className="text-bold margin-top-2" requiredMarker>
                Precipitation:
              </Label>
              <Select
                id={`${eventPrefix}-precipitation-select`}
                name="precipitationId"
                defaultValue={precipitationId || ""}
                required
              >
                <option value={null}>- Select -</option>
                {precipitation.map(({ id, description }) => (
                  <option key={id} value={id}>
                    {description}
                  </option>
                ))}
              </Select>
            </ResponsiveRow>
            <Grid row gap>
              <Grid col={12} >
                <Grid row>
                  <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
                    <Label htmlFor={`${eventPrefix}-comment`} className="text-bold margin-top-2" >Comments:</Label>
                  </Grid>
                  <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
                    <Textarea id={`${eventPrefix}-comment`} name="comments" className="app-textarea" defaultValue={comments || ""} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid >
        </Grid >
        <Grid row className="flex-column flex-align-end">
          <Button type="submit" className="margin-right-0">{`Save ${eventLabel}`}</Button>
        </Grid>
      </Form >
    </>
  );
};

export default EventForm;
