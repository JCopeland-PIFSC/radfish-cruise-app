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
import AppCard from "./AppCard";
import { useListTablesContext } from "../context";
import ResponsiveRow from "./ResponsiveRow";

const StationNew = ({ handleNewStation }) => {
  const { lists } = useListTablesContext();
  const { precipitation } = lists;
  const inputFocus = useRef(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, []);

  return (
    <AppCard>
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
              <ResponsiveRow>
                <Label htmlFor="latitude" className="text-bold margin-top-2" hint=" (Decimal Deg)" requiredMarker>Latitude:</Label>
                <TextInput id="latitude" name="latitude" required />
                <Label htmlFor="longitude" className="text-bold margin-top-2" hint=" (Decimal Deg)" requiredMarker>Longitude:</Label>
                <TextInput id="longitude" name="longitude" required />
              </ResponsiveRow>
              <ResponsiveRow>
                <Label htmlFor="begin-set-date" className="text-bold margin-top-2" hint=" (MM/DD/YYYY)" requiredMarker>Begin Set Date:</Label>
                <DatePicker id="begin-set-date" name="eventDate" required />
                <Label htmlFor="begin-set-time" className="text-bold margin-top-2" hint=" (24hr 00:00 - 23:59)" requiredMarker>Begin Set Time:</Label>
                <TextInputMask id="begin-set-time" name="eventTime" type="text" aria-labelledby="time" aria-describedby="hint-time" mask="__:__" pattern="([01]\d|2[0-3]):[0-5]\d" />
              </ResponsiveRow>
              <ResponsiveRow>
                <Label htmlFor="wind-speed" className="text-bold margin-top-2" hint=" (Knots)" requiredMarker>Wind Speed:</Label>
                <TextInput id="wind-speed" name="windSpeed" required />
                <Label htmlFor="wave-height" className="text-bold margin-top-2" hint=" (Meters)" requiredMarker>Wave Height:</Label>
                <TextInput id="wave-height" name="waveHeight" required />
              </ResponsiveRow>
              <ResponsiveRow>
                <Label htmlFor="visibility" className="text-bold margin-top-2" hint=" (Km)" requiredMarker>Visibility:</Label>
                <TextInput id="visibility" name="visibility" required />
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
              </ResponsiveRow>

              <Grid row gap>
                <Grid col={12} >
                  <Grid row>
                    <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
                      <Label htmlFor="begin-set-comments" className="text-bold margin-top-2" >Comments:</Label>
                    </Grid>
                    <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
                      <Textarea id="begin-set-comments" name="comments" className="app-textarea" />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Fieldset>
          </Grid>
        </Grid>
        <Grid row className="flex-column flex-align-end">
          <Button type="submit" >Add Station</Button>
        </Grid>
      </Form>
    </AppCard>
  );
};

export default StationNew;
