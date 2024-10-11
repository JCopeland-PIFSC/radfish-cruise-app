import "../index.css";
import React from "react";
import { Button } from "@trussworks/react-uswds";
import { Link } from "react-router-dom";
import { Table } from "@nmfs-radfish/react-radfish";

function HomePage({ cruiseList, portsList, cruiseStatusList }) {

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
    <Table columns={columns} data={cruiseList} bordered striped />
  );
}

export default HomePage;
