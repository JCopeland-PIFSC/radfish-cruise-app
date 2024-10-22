import "../index.css";
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Title, Form, Button, GridContainer, Grid, Label, TextInput, Select } from "@trussworks/react-uswds";
import { CruiseContext, ACTIONS } from '../CruiseContext';
import { DatePicker } from "@nmfs-radfish/react-radfish";
import { useNavigate } from "react-router-dom";

function CruiseNewPage() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(CruiseContext);
  const { ports } = state;
  const [resetToggle, setResetToggle] = useState(false);
  const inputFocus = useRef(null);

  const handleNavCruisesList = () => {
    navigate("/cruises");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = { cruiseStatusId: 1 };
    let alertString = 'cruiseStatusId: 1\n';

    for (const [key, value] of formData.entries()) {
      values[key] = value;
      alertString += `${key}: ${value}\n`;
    }

    window.alert(alertString);
    event.target.reset();
    setResetToggle(true);
  }

  const handleReset = (event) => {
    event.preventDefault();
    event.target.reset();
    setResetToggle(true);
  }

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    };
    setResetToggle(false);
  }, [resetToggle]);

  return (
    <>
      <Title>New Cruise Form</Title>
      <GridContainer containerSize="tablet-lg">
        <Grid row className="margin-top-2">
          <Button onClick={handleNavCruisesList} >{`< Cruise List`}</Button>
        </Grid>
        <Form onSubmit={handleSubmit} onReset={handleReset}>
          <Grid row>
            <Label htmlFor="cruise-name" requiredMarker>Cruise Name:</Label>
            <TextInput id="cruise-name" name="cruiseName" inputRef={inputFocus} required />
          </Grid>
          <Grid row>
            <Label htmlFor="vessel-name" requiredMarker>Vessel Name:</Label>
            <TextInput id="vessel-name" name="vesselName" required />
          </Grid>
          <Grid row>
            <DatePicker name="startDate" label="Start Date:" required />
          </Grid>
          <Grid row>
            <Label htmlFor="departure-port-select" requiredMarker>Departure Port:</Label>
            <Select
              id="departure-port-select"
              name="departurePortId"
              required
            >
              <option value={null}>- Select Port -</option>
              {
                ports.map(port => (
                  <option key={port.id} value={port.id}>{port.name}</option>
                ))
              }
            </Select>
          </Grid>
          <Grid row>
            <Button type="reset" secondary>Reset</Button>
            <Button type="submit">Add Cruise</Button>
          </Grid>
        </Form>
      </GridContainer>
    </>
  );
};

export default CruiseNewPage;