import { Grid, Label, TextInput, Select, Button, Icon } from "@trussworks/react-uswds";

const SampleInput = ({ sample, dataIndex, sampleTypesList, onChange, handleRemoveSample }) => {
  const { lengthCm, bioSample } = sample;
  const { sampleName, sampleTypeId, notes } = bioSample;

  return (
    <>
      <Grid row gap>
        <Grid col={12} tablet={{ col: true }}>
          <Grid row>
            <Label htmlFor={`sample-name-${dataIndex}`} className="grid-col-4 text-bold margin-top-2" requiredMarker>
              Sample Name:
            </Label>
            <TextInput
              id={`sample-name-${dataIndex}`}
              name="sampleName"
              value={sampleName || ""}
              onChange={onChange}
              className="grid-col-8"
              required />
          </Grid>
        </Grid>
        <Grid col={12} tablet={{ col: true }}>
          <Grid row>
            <Label htmlFor={`sample-length-${dataIndex}`} className="grid-col-4 text-bold margin-top-2" requiredMarker>
              Sample Length:
            </Label>
            <TextInput
              id={`sample-length-${dataIndex}`}
              name="lengthCm"
              value={lengthCm || ""}
              onChange={onChange}
              className="grid-col-8"
              required />
          </Grid>
        </Grid>
      </Grid>
      <Grid row gap>
        <Grid col={12} tablet={{ col: true }} >
          <Grid row>
            <Label htmlFor={`sample-type-${dataIndex}`} className="grid-col-4 text-bold margin-top-2" requiredMarker>
              Sample Type:
            </Label>
            <Select
              id={`sample-type-${dataIndex}`}
              name="sampleTypeId"
              value={sampleTypeId || ""}
              onChange={onChange}
              className="grid-col-8"
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
        <Grid col={12} tablet={{ col: true }} >
          <Grid row className="flex-justify-end">
            <Button type="button" onClick={handleRemoveSample} className="margin-right-0" accentStyle="warm" >
              <Icon.Delete aria-hidden={true} alt="delete sample" />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default SampleInput;