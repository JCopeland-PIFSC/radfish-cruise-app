import React, { useEffect, useState, useRef, useContext } from "react";
import { Grid, TextInput, Label, DatePicker, TimePicker, Button, Form, Textarea, Select } from "@trussworks/react-uswds";
import { CruiseContext } from "../CruiseContext";

export const StationNew = ({ handleNewStation }) => {
  const { state } = useContext(CruiseContext);
  const { precipitation } = state;
  const [resetToggle, setResetToggle] = useState(false);
  const inputFocus = useRef(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
    setResetToggle(false);
  }, [resetToggle]);

  return (
    <div className="border padding-1 margin-bottom-1 radius-lg app-box-shadow">
      <Form className="maxw-full" onSubmit={handleNewStation}>
        <Grid row gap>
          <Grid col={true} tablet={{ col: 6 }}>
            <Label htmlFor="station-name" className="text-bold margin-top-1" requiredMarker>Station Name:</Label>
            <TextInput id="station-name" name="stationName" inputRef={inputFocus} required />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <Label htmlFor="latitude" className="text-bold margin-top-2" requiredMarker>Latitude:</Label>
            <TextInput id="latitude" name="latitude" required />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <Label htmlFor="longitude" className="text-bold margin-top-2" requiredMarker>Longitude:</Label>
            <TextInput id="longitude" name="longitude" required />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <Label htmlFor="begin-set-date" className="text-bold margin-top-2" requiredMarker>Begin Set Date:</Label>
            <DatePicker id="begin-set-date" name="beginSetDate" required />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <TimePicker id="begin-set-time" name="beginSetTime" label={<span className="text-bold">Begin Set Time:</span>} required />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <Label htmlFor="wind-speed" className="text-bold margin-top-2" requiredMarker>Wind Speed:</Label>
            <TextInput id="wind-speed" name="windSpeed" required />
          </Grid>
          <Grid col={12} tablet={{ col: true }}>
            <Label htmlFor="wave-height" className="text-bold margin-top-2" requiredMarker>Wave Height:</Label>
            <TextInput id="wave-height" name="waveHeight" required />
          </Grid>
        </Grid>
        <Grid row gap>
          <Grid col={12} tablet={{ col: true }}>
            <Label htmlFor="visibility" className="text-bold margin-top-2" requiredMarker>Visibility:</Label>
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
            <Label htmlFor="begin-set-comment" className="text-bold margin-top-2" >Comments:</Label>
            <Textarea id="begin-set-comment" name="beginSetComment" />
          </Grid>
        </Grid>
        <Grid row className="flex-column flex-align-end">
          <Button type="submit" >Add Station</Button>
        </Grid>
      </Form>
    </div>
  );
};
