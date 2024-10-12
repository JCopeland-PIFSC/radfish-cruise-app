import "../index.css";
import React from "react";
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { Table } from "@nmfs-radfish/react-radfish";

function CruiseListPage({ cruiseList, portsList, cruiseStatusList }) {

  const columns = [
    {
      key: "cruiseName",
      label: "Name",
      sortable: true,
    },
    {
      key: "departurePort",
      label: "Departure Port",
      render: (row) => {
        const port = portsList.find(elem => elem.id === row.departurePort);
        return port ? port.name : '';
      }
    },
    {
      key: "returnPort",
      label: "Return Port",
      render: (row) => {
        const port = portsList.find(elem => elem.id === row.returnPort);
        return port ? port.name : '';
      }
    },
    {
      key: "cruiseStatus",
      label: "Status",
      render: (row) => {
        const status = cruiseStatusList.find(elem => elem.id === row.cruiseStatus);
        return status ? status.name : '';
      }
    },
    {
      key: "startDate",
      label: "Start Date"
    }
  ];

  return (
    <GridContainer containerSize="tablet-lg">
      <Grid row className="margin-top-2">
        <Button size="big">New Cruise</Button>
      </Grid>
      <Grid row>
        <Table columns={columns} data={cruiseList} bordered striped fullWidth />
      </Grid>
    </GridContainer>
  );
}

export default CruiseListPage;
