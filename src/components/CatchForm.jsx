import { useState } from "react";
import { Grid, Form, Label, TextInput, Select, Button } from "@trussworks/react-uswds";
import SampleInput from "./SampleInput";
import ResponsiveRow from "./ResponsiveRow";

const InitializedSample = {
  "lengthCm": "",
  "bioSample": {
    "sampleName": "",
    "sampleTypeId": "",
    "notes": ""
  }
};

const CatchForm = ({ formData, speciesList, sampleTypesList, onSubmit }) => {
  const [localData, setLocalData] = useState(structuredClone(formData));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSampleInputChange = (event, index) => {
    const { name, value } = event.target;

    setLocalData((prev) => {
      const updatedIndividuals = [...prev.individuals];

      if (name in updatedIndividuals[index].bioSample) {
        updatedIndividuals[index] = {
          ...updatedIndividuals[index],
          bioSample: {
            ...updatedIndividuals[index].bioSample,
            [name]: value,
          },
        };
      } else {
        updatedIndividuals[index] = {
          ...updatedIndividuals[index],
          [name]: value,
        };
      }

      return {
        ...prev,
        individuals: updatedIndividuals
      };
    });
  };

  const handleAddSample = (individual) => {
    setLocalData((prev) => ({
      ...prev,
      individuals: [individual, ...prev.individuals]
    }));
  };

  const handleRemoveSample = (index) => {
    setLocalData((prev) => ({
      ...prev,
      individuals: prev.individuals.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localData);
  };

  return (
    <Form className="maxw-full" onSubmit={handleSubmit}>
      <ResponsiveRow>
        <Label htmlFor="species-select" className="text-bold margin-top-2" requiredMarker>
          Species:
        </Label>
        <Select
          id="species-select"
          name="speciesId"
          value={localData.speciesId}
          onChange={handleChange}
          required
        >
          <option value={null}>- Select Species -</option>
          {speciesList.map((species) => (
            <option key={species.id} value={species.id}>
              {species.name}
            </option>
          ))}
        </Select>
        <Label htmlFor="catch-weight" className="text-bold margin-top-2" requiredMarker>
          Total Weight:
        </Label>
        <TextInput
          id="catch-weight"
          name="aggregateWeightKg"
          value={localData.aggregateWeightKg}
          onChange={handleChange}
          required />
      </ResponsiveRow>
      <Grid row className="flex-justify-end margin-bottom-2">
        <Button
          type="button"
          className="btn-fix-top-3 margin-right-0"
          onClick={() => handleAddSample(structuredClone(InitializedSample))}
        >Add New Sample</Button>
      </Grid>
      <hr className="border-top-width-05 border-base" />
      {localData.individuals.length
        ? localData.individuals.map((sample, idx) => (
          <div key={idx}>
            {(idx > 0) && <hr className="app-hr-light" />}
            <SampleInput
              sample={sample}
              dataIndex={idx}
              onChange={(event) => handleSampleInputChange(event, idx)}
              handleRemoveSample={() => handleRemoveSample(idx)}
              sampleTypesList={sampleTypesList} />
          </div>
        ))
        : <p>No Samples Recorded</p>
      }
      <>
        <hr className="app-hr-light" />
        <Grid row className="flex-column flex-align-end">
          <Button type="submit" className="margin-right-0">Save Catch</Button>
        </Grid>
      </>
    </Form >
  );
}

export default CatchForm;
