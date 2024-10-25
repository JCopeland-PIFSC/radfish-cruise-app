import "../index.css";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  GridContainer,
  Grid,
  Title,
  Icon,
} from "@trussworks/react-uswds";
import { Table } from "@nmfs-radfish/react-radfish";
import { CruiseContext } from "../CruiseContext";
import { listValueLookup } from "../utils/listLookup";

function CruiseListPage() {
  const navigate = useNavigate();
  const { state } = useContext(CruiseContext);
  const { ports, cruiseStatuses, cruises, cruisesLoading } = state;

  if (cruisesLoading) return <div>Loading...</div>;

  const handleNavNewCruise = () => {
    navigate("/cruises/new");
  };

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
        return listValueLookup(ports, row.departurePortId);
      },
    },
    {
      key: "returnPort",
      label: "Return Port",
      render: (row) => {
        return listValueLookup(ports, row.returnPortId);
      },
    },
    {
      key: "cruiseStatus",
      label: "Status",
      render: (row) => {
        return listValueLookup(cruiseStatuses, row.cruiseStatusId);
      },
    },
    {
      key: "startDate",
      label: "Start Date",
    },
    {
      key: "cruiseEdit",
      label: "Edit Cruise",
      render: (row) => (
        <Link to={`/cruises/${row.id}`}>
          <Button role="button" aria-label="Edit item">
            <Icon.Edit alt="edit icon" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <Title>Cruise List</Title>
      <GridContainer containerSize="tablet-lg">
        <Grid row className="flex-column flex-align-end margin-top-2">
          <Grid col>
            <Button className="margin-right-0" onClick={handleNavNewCruise}>
              New Cruise
            </Button>
          </Grid>
        </Grid>
        <Grid row>
          <Table columns={columns} data={cruises} bordered striped scrollable />
        </Grid>
      </GridContainer>
    </>
  );
}

export default CruiseListPage;
