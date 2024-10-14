import "../index.css";
import React, { useContext } from 'react';
import { Button, GridContainer, Grid } from "@trussworks/react-uswds";
import { Table } from "@nmfs-radfish/react-radfish";
import { ListContext } from '../ListContext';

function CruiseListPage() {
  const { state } = useContext(ListContext);
  const { ports, cruiseStatuses, cruises, cruisesLoading } = state;

  if (cruisesLoading) return <div>Loading...</div>;

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
        const port = ports.find(elem => elem.id === row.departurePortId);
        return port ? port.name : '';
      }
    },
    {
      key: "returnPort",
      label: "Return Port",
      render: (row) => {
        const port = ports.find(elem => elem.id === row.returnPortId);
        return port ? port.name : '';
      }
    },
    {
      key: "cruiseStatus",
      label: "Status",
      render: (row) => {
        const status = cruiseStatuses.find(elem => elem.id === row.cruiseStatusId);
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
        <Table columns={columns} data={cruises} bordered striped fullWidth />
      </Grid>
    </GridContainer>
  );
}

export default CruiseListPage;
