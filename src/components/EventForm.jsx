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
import { camelToDash, camelToTitleCase } from "../utils/stringUtilities";
import { getTzDateTimeParts } from "../utils/dateTimeHelpers";
import { usePrecipitationList } from "../hooks/useListTables";

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
  const {
    data: precipitation,
    isLoading: precipitationLoading,
    isError: precipitationError,
    error } = usePrecipitationList();
  const eventPrefix = camelToDash(eventType);
  const eventLabel = camelToTitleCase(eventType);

  // Render loading/error states
  if (precipitationLoading) {
    return <div>Loading...</div>;
  }

  if (precipitationError) {
    return <div>Error loading Species: {error.message}</div>;
  }
  return (
    <Form id={`${eventPrefix}-form`} name={`${eventType}Form`} className="maxw-full" onSubmit={handleSaveEvent}>
      <Grid row>
        <Grid col={12}>
          <Grid row gap>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-date`} className="grid-col-4 text-bold margin-top-05" hint=" (MM/DD/YYYY)" requiredMarker>Date:</Label>
                <DatePicker id={`${eventPrefix}-date`} name="eventDate" className="grid-col-8" defaultValue={getTzDateTimeParts(timestamp).date} required />
              </Grid>
            </Grid>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-time`} className="grid-col-4 text-bold margin-top-05" hint=" (24hr hh:mm)" requiredMarker>Time:</Label>
                <TextInputMask id={`${eventPrefix}-time`} name="eventTime" type="text" className="grid-col-8" defaultValue={getTzDateTimeParts(timestamp).time} aria-labelledby="time" aria-describedby="hint-time" mask="__:__" pattern="([01]\d|2[0-3]):[0-5]\d" />
              </Grid>
            </Grid>
          </Grid>
          <Grid row gap>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-latitude`} className="grid-col-4 text-bold margin-top-05" hint=" (Decimal Deg)" requiredMarker>Latitude:</Label>
                <TextInput id={`${eventPrefix}-latitude`} name="latitude" className="grid-col-8" defaultValue={latitude} required />
              </Grid>
            </Grid>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-longitude`} className="grid-col-4 text-bold margin-top-05" hint=" (Decimal Deg)" requiredMarker>Longitude:</Label>
                <TextInput id={`${eventPrefix}-longitude`} name="longitude" className="grid-col-8" defaultValue={longitude} required />
              </Grid>
            </Grid>
          </Grid >
          <Grid row gap>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-wind-speed`} className="grid-col-4 text-bold margin-top-05" hint=" (Knots)" requiredMarker>Wind Speed:</Label>
                <TextInput id={`${eventPrefix}-wind-speed`} name="windSpeed" className="grid-col-8" defaultValue={windSpeedKnots} required />
              </Grid>
            </Grid>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-wave-height`} className="grid-col-4 text-bold margin-top-05" hint=" (Meters)" requiredMarker>Wave Height:</Label>
                <TextInput id={`${eventPrefix}-wave-height`} name="waveHeight" className="grid-col-8" defaultValue={waveHeightMeters} required />
              </Grid>
            </Grid >
          </Grid >
          <Grid row gap>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-visibility`} className="grid-col-4 text-bold margin-top-2" hint=" (Km)" requiredMarker>Visibility:</Label>
                <TextInput id={`${eventPrefix}-visibility`} name="visibility" className="grid-col-8" defaultValue={visibilityKm} required />
              </Grid>
            </Grid>
            <Grid col={12} tablet={{ col: true }}>
              <Grid row>
                <Label htmlFor={`${eventPrefix}-precipitation-select`} className="grid-col-4 text-bold margin-top-2" requiredMarker>
                  Precipitation:
                </Label>
                <Select
                  id={`${eventPrefix}-precipitation-select`}
                  name="precipitationId"
                  className="grid-col-8"
                  defaultValue={precipitationId}
                  required
                >
                  <option value={null}>- Select -</option>
                  {precipitation.map(({ id, description }) => (
                    <option key={id} value={id}>
                      {description}
                    </option>
                  ))}
                </Select>
              </Grid >
            </Grid >
          </Grid >
          <Grid row gap>
            <Grid col={12} >
              <Label htmlFor={`${eventPrefix}-comment`} className="text-bold margin-top-2" >Comments:</Label>
              <Textarea id={`${eventPrefix}-comment`} name="comments" defaultValue={comments} />
            </Grid>
          </Grid>
        </Grid >
      </Grid >
      <Grid row className="flex-column flex-align-end">
        <Button type="submit" className="margin-right-0">{`Save ${eventLabel}`}</Button>
      </Grid>
    </Form >
  );
};

export default EventForm;
