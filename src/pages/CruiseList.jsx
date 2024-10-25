import "../index.css";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Grid, Icon, Tag } from "@trussworks/react-uswds";
import { Table } from "@nmfs-radfish/react-radfish";
import { CruiseContext } from "../CruiseContext";
import { listValueLookup } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";

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
        const cruiseStatus = listValueLookup(cruiseStatuses, row.cruiseStatusId);
        return (
          <Tag className={`usa-tag--big ${setStatusColor(row.cruiseStatusId)}`}>{cruiseStatus}</Tag>
        )
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
          <Button>
            <Icon.Edit aria-hidden={true} alt="edit icon" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <Grid row>
        <Grid col>
          <h1 className="app-sec-header">Cruise List</h1>
        </Grid>
        <Grid col>
          <Button className="margin-right-0" onClick={handleNavNewCruise}>
            New Cruise
          </Button>
        </Grid>
      </Grid>
      <Grid row>
        <Table columns={columns} data={cruises} className="margin-top-0" bordered striped scrollable />
      </Grid>
    </>
  );
}

export default CruiseListPage;
