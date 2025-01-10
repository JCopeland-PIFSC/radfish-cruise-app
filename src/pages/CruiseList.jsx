import "../index.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Tag } from "@trussworks/react-uswds";
import { Table } from "@nmfs-radfish/react-radfish";
import { listValueLookup } from "../utils/listLookup";
import { setStatusColor } from "../utils/setStatusColor";
import { usePortsList, useCruiseStatusesList } from "../hooks/useListTables";
import { useGetUserCruises } from "../hooks/useCruises";
import { useAuth } from "../context/AuthContext";

const CruiseListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: ports,
    isError: portsError,
    errorPorts } = usePortsList();
  const {
    data: cruiseStatuses,
    isError: cruiseStatusesError,
    errorCruiseStatuses } = useCruiseStatusesList();
  const { cruises, loading, error } = useGetUserCruises();
  if (loading) return <div>Loading Cruises...</div>;
  if (portsError || cruiseStatusesError) return <div>Error Loading List Data: {portsError ? errorPorts.message : errorCruiseStatuses.message}</div>;
  if (error) return <div>Error Loading Cruise Data: {errorCruises?.message}</div>;

  const handleNavNewCruise = () => {
    navigate("/cruises/new");
  };

  const handleRowClick = ({ id }) => {
    navigate(`/cruises/${id}`);
  }

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
  ];

  return (
    <>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Cruise List</h1>
        <Button className="margin-right-0" onClick={handleNavNewCruise}>
          New Cruise
        </Button>
      </Grid>
      <Grid row className="margin-top-2">
        <Table columns={columns} data={cruises?.length ? cruises : []} onRowClick={handleRowClick} className="margin-top-0" bordered striped />
        {!cruises?.length && <p>No Cruises Recorded!</p>}
      </Grid>
    </>
  );
}

export default CruiseListPage;
