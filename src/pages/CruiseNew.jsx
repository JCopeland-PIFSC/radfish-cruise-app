import "../index.css";
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Form,
  Button,
  Grid,
  Label,
  TextInput,
  Select,
} from "@trussworks/react-uswds";
import { CruiseContext, ACTIONS } from "../CruiseContext";
import { DatePicker } from "@nmfs-radfish/react-radfish";
import { useNavigate } from "react-router-dom";
import { post } from "../utils/requestMethods";

const API_BASE_URL = "http://localhost:5000";

function CruiseNewPage() {
  const navigate = useNavigate();
  const { dispatch, state } = useContext(CruiseContext);
  const { ports } = state;
  const [resetToggle, setResetToggle] = useState(false);
  const inputFocus = useRef(null);

  const handleNavCruisesList = () => {
    navigate("/cruises");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const values = { cruiseStatusId: 1, returnPort: null, endDate: null };

    for (const [key, value] of formData.entries()) {
      values[key] = value;
    }

    const newCruise = await post(`${API_BASE_URL}/cruises`, values);
    dispatch({ type: ACTIONS.SET_NEW_CRUISE, payload: newCruise });
    event.target.reset();
    setResetToggle(true);
    navigate(`/cruises/${newCruise.id}`);
  };

  const handleReset = (event) => {
    event.preventDefault();
    event.target.reset();
    setResetToggle(true);
  };

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
    setResetToggle(false);
  }, [resetToggle]);

  return (
    <>
      <Grid row className="margin-top-2">
        <Button onClick={handleNavCruisesList}>&lt; Cruise List</Button>
      </Grid>
      <Grid row>
        <h1 className="app-sec-header">New Cruise Form</h1>
      </Grid>
      <Grid row>
        <div className="border radius-lg padding-1 margin-bottom-2 app-box-shadow">
          <Grid col>
            <Form onSubmit={handleSubmit} onReset={handleReset}>
              <Grid row>
                <Label htmlFor="cruise-name" className="text-bold" requiredMarker>
                  Cruise Name:
                </Label>
                <TextInput
                  id="cruise-name"
                  name="cruiseName"
                  inputRef={inputFocus}
                  required
                />
              </Grid>
              <Grid row>
                <Label htmlFor="vessel-name" className="text-bold" requiredMarker>
                  Vessel Name:
                </Label>
                <TextInput id="vessel-name" name="vesselName" required />
              </Grid>
              <Grid row>
                <DatePicker name="startDate" label="Start Date:" required />
              </Grid>
              <Grid row>
                <Label htmlFor="departure-port-select" className="text-bold" requiredMarker>
                  Departure Port:
                </Label>
                <Select
                  id="departure-port-select"
                  name="departurePortId"
                  required
                >
                  <option value={null}>- Select Port -</option>
                  {ports.map((port) => (
                    <option key={port.id} value={port.id}>
                      {port.name}
                    </option>
                  ))}
                </Select>
              </Grid>
              <Grid row>
                <Button type="reset" secondary>
                  Reset
                </Button>
                <Button type="submit">Add Cruise</Button>
              </Grid>
            </Form>
          </Grid>
        </div>
      </Grid>
    </>
  );
}

export default CruiseNewPage;
