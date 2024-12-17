import { Grid, Form, Label, TextInput, Fieldset, Select, Button, DatePicker } from "@trussworks/react-uswds";
import ResponsiveRow from "./ResponsiveRow";

const CruiseForm = ({ cruise, ports, handleSaveCruise }) => {
  const { cruiseName,
    vesselName,
    startDate,
    endDate,
    departurePortId,
    returnPortId } = cruise;

  return (
    <Form className="maxw-full" onSubmit={handleSaveCruise}>
      <ResponsiveRow>
        <Label htmlFor="cruise-name" className="text-bold margin-top-2" requiredMarker>
          Cruise Name:
        </Label>
        <TextInput id="cruise-name" name="cruiseName" defaultValue={cruiseName} required />
        <Label htmlFor="vessel-name" className="text-bold margin-top-2" requiredMarker>
          Vessel Name:
        </Label>
        <TextInput id="vessel-name" name="vesselName" defaultValue={vesselName} required />
      </ResponsiveRow>

      <Grid row gap>
        <Grid col={12} tablet={{ col: true }}>
          <Fieldset legend="Departure" className="app-legend-bold-text margin-top-2">
            <Grid row>
              <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
                <Label htmlFor="start-date" className="text-bold margin-top-2" requiredMarker>
                  Date:
                </Label>
              </Grid>
              <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
                <DatePicker id="start-date" name="startDate" className="margin-top-0" defaultValue={startDate} required />
              </Grid>
            </Grid>
            <Grid row>
              <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
                <Label htmlFor="departure-port-select" className="text-bold margin-top-2" requiredMarker>
                  Port:
                </Label>
              </Grid>
              <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
                <Select
                  id="departure-port-select"
                  name="departurePortId"
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
            </Grid>
          </Fieldset>
        </Grid>
        <Grid col>
          <Fieldset legend="Return" className="app-legend-bold-text margin-top-2">
            <Grid row>
              <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
                <Label htmlFor="end-date" className="text-bold margin-top-2" >
                  Date:
                </Label>
              </Grid>
              <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
                <DatePicker id="end-date" name="endDate" className="margin-top-0" defaultValue={endDate} />
              </Grid>
            </Grid>
            <Grid row>
              <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
                <Label htmlFor="return-port-select" className="text-bold margin-top-2" >
                  Port:
                </Label>
              </Grid>
              <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
                <Select
                  id="return-port-select"
                  name="returnPortId"
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