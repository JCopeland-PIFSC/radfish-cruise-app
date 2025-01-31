import { Grid, Label, TextInput, Select, Button, Icon } from "@trussworks/react-uswds";
import ResponsiveRow from "./ResponsiveRow";

const SampleInput = ({ sample, dataIndex, sampleTypesList, onChange, handleRemoveSample }) => {
  const { lengthCm, bioSample } = sample;
  const { sampleName, sampleTypeId, notes } = bioSample;

  return (
    <>
      <ResponsiveRow>
        <Label htmlFor={`sample-name-${dataIndex}`} className="text-bold margin-top-2" requiredMarker>
          Sample Name:
        </Label>
        <TextInput
          id={`sample-name-${dataIndex}`}
          name="sampleName"
          value={sampleName || ""}
          onChange={onChange}
          required />
        <Label htmlFor={`sample-length-${dataIndex}`} className="text-bold margin-top-2" requiredMarker>
          Sample Length:
        </Label>
        <TextInput
          id={`sample-length-${dataIndex}`}
          name="lengthCm"
          value={lengthCm || ""}
          onChange={onChange}
          required />
      </ResponsiveRow>
      <Grid row gap>
        <Grid col={12} tablet={{ col: true }} >
          <Grid row>
            <Grid col={12} mobileLg={{ col: 4 }} tablet={{ col: 12 }}>
              <Label htmlFor={`sample-type-${dataIndex}`} className="text-bold margin-top-2" requiredMarker>
                Sample Type:
              </Label>
            </Grid>
            <Grid col={12} mobileLg={{ col: 8 }} tablet={{ col: 12 }}>
              <Select
                id={`sample-type-${dataIndex}`}
                name="sampleTypeId"
                value={sampleTypeId || ""}
                onChange={onChange}
                required
              >
                <option value={null}>- Select Type -</option>
                {sampleTypesList.map((sample) => (
                  <option key={sample.id} value={sample.id}>
                    {sample.name}
                  </option>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <div className="display-flex flex-column height-full">
            <Button type="button" onClick={handleRemoveSample} className="btn-bot-right" accentStyle="warm" >
              <Icon.Delete aria-hidden={true} aria-label="delete sample" />
            </Button>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default SampleInput;