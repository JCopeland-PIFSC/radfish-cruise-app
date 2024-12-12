import { Grid, Form, Label, TextInput, Fieldset, Select, Button, DatePicker } from "@trussworks/react-uswds";

const CruiseForm = ({ cruise, ports, handleSaveCruise }) => {
  const { cruiseName,
    vesselName,
    startDate,
    endDate,
    departurePortId,
    returnPortId } = cruise;

  return (
    <Form className="maxw-full" onSubmit={handleSaveCruise}>
      <Grid row gap>
        <Grid col={12} tablet={{ col: true }}>
          <Grid row>
            <Label htmlFor="cruise-name" className="grid-col-4 text-bold margin-top-2" requiredMarker>
              Cruise Name:
            </Label>
            <TextInput id="cruise-name" name="cruiseName" className="grid-col-8" defaultValue={cruiseName} required />
          </Grid>
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <Grid row>
            <Label htmlFor="vessel-name" className="grid-col-4 text-bold margin-top-2" requiredMarker>
              Vessel Name:
            </Label>
            <TextInput id="vessel-name" name="vesselName" className="grid-col-8" defaultValue={vesselName} required />
          </Grid>
        </Grid>
      </Grid>
      <Grid row gap>
        <Grid col={12} tablet={{ col: true }}>
          <Fieldset legend="Departure" className="app-legend-bold-text">
            <Grid row>
              <Label htmlFor="start-date" className="grid-col-4 text-bold margin-top-2" requiredMarker>
                Date:
              </Label>
              <DatePicker id="start-date" name="startDate" className="grid-col-8 margin-top-0" defaultValue={startDate} required />
            </Grid>
            <Grid row>
              <Label htmlFor="departure-port-select" className="grid-col-4 text-bold margin-top-2" requiredMarker>
                Port:
              </Label>
              <Select
                id="departure-port-select"
                name="departurePortId"
                className="grid-col-8"
                defaultValue={departurePortId}
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
          </Fieldset>
        </Grid>
        <Grid col>
          <Fieldset legend="Return" className="app-legend-bold-text">
            <Grid row>
              <Label htmlFor="end-date" className="grid-col-4 text-bold margin-top-2" >
                Date:
              </Label>
              <DatePicker id="end-date" name="endDate" className="grid-col-8 margin-top-0" defaultValue={endDate} />
            </Grid>
            <Grid row>
              <Label htmlFor="return-port-select" className="grid-col-4 text-bold margin-top-2" >
                Port:
              </Label>
              <Select
                id="return-port-select"
                name="returnPortId"
                className="grid-col-8"
                defaultValue={returnPortId}
              >
                <option value={null}>- Select Port -</option>
                {ports.map((port) => (
                  <option key={port.id} value={port.id}>
                    {port.name}
                  </option>
                ))}
              </Select>
            </Grid>
          </Fieldset>
        </Grid>
      </Grid>
      <Grid row className="flex-column flex-align-end">
        <Button type="submit" className="margin-right-0">Save Cruise</Button>
      </Grid>
    </Form>
  );
}

export default CruiseForm;