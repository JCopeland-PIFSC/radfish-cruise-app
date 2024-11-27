import React, { useEffect, useRef } from "react";
import {
  Grid,
  TextInput,
  Label,
  DatePicker,
  TextInputMask,
  Button,
  Form,
  Textarea,
  Select,
  Fieldset
} from "@trussworks/react-uswds";
import { usePrecipitationList } from "../hooks/useCoreTables";

const StationNew = ({ handleNewStation }) => {
  const {
    data: precipitation,
    isLoading: precipitationLoading,
    isError: precipitationError,
    error } = usePrecipitationList();
  const inputFocus = useRef(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, []);

  // Render loading/error states
  if (precipitationLoading) {
    return <div>Loading...</div>;
  }

  if (precipitationError) {
    return <div>Error loading Species: {error.message}</div>;
  }

  return (
    <div className="border padding-1 margin-y-2 radius-lg app-card">
      <Form className="maxw-full" onSubmit={handleNewStation}>
        <Grid row gap>
          <Grid col={true} tablet={{ col: 6 }}>
            <Label htmlFor="station-name" className="text-bold margin-top-1" requiredMarker>Station Name:</Label>
            <TextInput id="station-name" name="stationName" inputRef={inputFocus} required />
          </Grid>
        </Grid>
        <Grid row className="margin-top-2">
          <Grid col={12}>
            <Fieldset legend="Begin Set" className="app-legend-bold-text top-margin-1">
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="latitude" className="text-bold margin-top-1" hint=" (Decimal Deg)" requiredMarker>Latitude:</Label>
                  <TextInput id="latitude" name="latitude" required />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="longitude" className="text-bold margin-top-2 tablet:margin-top-1" hint=" (Decimal Deg)" requiredMarker>Longitude:</Label>
                  <TextInput id="longitude" name="longitude" required />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="begin-set-date" className="text-bold margin-top-2" hint=" (MM/DD/YYYY)" requiredMarker>Begin Set Date:</Label>
                  <DatePicker id="begin-set-date" name="eventDate" required />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="begin-set-time" className="text-bold margin-top-2" hint=" (24hr 00:00 - 23:59)" requiredMarker>Begin Set Time:</Label>
                  <TextInputMask id="begin-set-time" name="eventTime" type="text" aria-labelledby="time" aria-describedby="hint-time" mask="__:__" pattern="([01]\d|2[0-3]):[0-5]\d" />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="wind-speed" className="text-bold margin-top-2" hint=" (Knots)" requiredMarker>Wind Speed:</Label>
                  <TextInput id="wind-speed" name="windSpeed" required />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="wave-height" className="text-bold margin-top-2" hint=" (Meters)" requiredMarker>Wave Height:</Label>
                  <TextInput id="wave-height" name="waveHeight" required />
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="visibility" className="text-bold margin-top-2" hint=" (Km)" requiredMarker>Visibility:</Label>
                  <TextInput id="visibility" name="visibility" required />
                </Grid>
                <Grid col={12} tablet={{ col: true }}>
                  <Label htmlFor="precipitation-select" className="text-bold margin-top-2" requiredMarker>
                    Precipitation:
                  </Label>
                  <Select
                    id="precipitation-select"
                    name="precipitationId"
                    required
                  >
                    <option value={null}>- Select -</option>
                    {precipitation.map((precip) => (
                      <option key={precip.id} value={precip.id}>
                        {precip.description}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid row gap>
                <Grid col={12} >
                  <Label htmlFor="begin-set-comments" className="text-bold margin-top-2" >Comments:</Label>
                  <Textarea id="begin-set-comments" name="comments" />
                </Grid>
              </Grid>
            </Fieldset>
          </Grid>
        </Grid>
        <Grid row className="flex-column flex-align-end">
          <Button type="submit" >Add Station</Button>
        </Grid>
      </Form>
    </div>
  );
};

export default StationNew;
