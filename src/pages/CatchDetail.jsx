import { useState, useEffect } from "react";
import { Grid, Button } from "@trussworks/react-uswds";
import AppCard from "../components/AppCard";
import CatchView from "../components/CatchView";
import CatchForm from "../components/CatchForm";
import HeaderWithEdit from "../components/HeaderWithEdit";
import { useParams, useNavigate } from "react-router-dom";
import { useSampleTypesList, useSpeciesList } from "../hooks/useListTables";
import { useUpdateStation, useGetCruiseById, useGetStationById } from "../hooks/useCruises";

const CatchAction = {
  NEW: "NEW",
  EDIT: "EDIT",
};

const InitializedCatch = {
  "speciesId": "",
  "aggregateWeightKg": "",
  "individuals": []
};

const CatchDetailPage = () => {
  const { cruiseId, stationId } = useParams();
  const { data: cruise, } = useGetCruiseById(cruiseId);
  const {
    data: station,
    isLoading: stationLoading,
    isError: stationError,
    error: errorStation
  } = useGetStationById(stationId);
  const { data: species, } = useSpeciesList();
  const { data: sampleTypes, } = useSampleTypesList();
  const { mutateAsync: updateStation } = useUpdateStation();
  const navigate = useNavigate();
  const [catches, setCatches] = useState([]);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    if (station?.catch) {
      setCatches(station.catch);
    }
  }, [station?.catch]);

  if (stationLoading) return <div>Loading Station Data...</div>;
  if (stationError) return <div>Error Loading Station Data: {errorStation?.message}</div>;

  const { cruiseName } = cruise;
  const { stationName } = station;

  const handleNavCruiseDetail = (cruiseId) => {
    navigate(`/cruises/${cruiseId}`);
  };

  const handleNewCatch = (newCatch) => {
    setCatches((prevCatches) => {
      const updatedCatches = [...prevCatches, newCatch];
      handleSave(updatedCatches);
      return updatedCatches;
    });
  };

  const handleEditCatch = (index, updatedCatch) => {
    setCatches((prevCatches) => {
      const updatedCatches = prevCatches.map((item, idx) =>
        idx === index ? { ...item, ...updatedCatch } : item
      );
      handleSave(updatedCatches);
      return updatedCatches;
    });
  };

  const handleSave = async (updatedCatches) => {
    try {
      await updateStation({
        cruiseId,
        stationId,
        updates: { ...station, catch: updatedCatches },
      });
      setActiveAction(null);
    } catch (error) {
      console.error("Failed to update station with new catch: ", error);
    }
  };

  return (
    <>
      <Grid row className="margin-top-2">
        <Button className="margin-right-0" onClick={() => handleNavCruiseDetail(cruiseId)} >&lt; Cruise: {cruiseName || ""}</Button>
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Station: {stationName.toUpperCase()}</h1>
      </Grid>
      <Grid row className="flex-justify margin-bottom-1">
        <h2 className="app-sec-header">Catches</h2>
        {
          activeAction === CatchAction.NEW
            ? <Button
              className="margin-right-0"
              onClick={() => setActiveAction(null)}
              secondary
            >
              Cancel New Catch
            </Button>
            : <Button
              className="margin-right-0"
              onClick={() => setActiveAction(CatchAction.NEW)}
              disabled={activeAction !== null && activeAction !== CatchAction.NEW}
            >
              Add New Catch
            </Button>
        }
      </Grid>
      {activeAction === CatchAction.NEW &&
        <AppCard>
          <CatchForm
            formData={structuredClone(InitializedCatch)}
            speciesList={species}
            sampleTypesList={sampleTypes}
            onSubmit={handleNewCatch} />
        </AppCard>}
      {catches && catches.length &&
        catches.map((catchItem, idx) => (
          <AppCard key={idx}>
            <HeaderWithEdit
              title=""
              editLabel={"Catch"}
              actionCheck={idx}
              activeAction={activeAction}
              handleSetAction={() => setActiveAction(idx)}
              handleCancelAction={() => setActiveAction(null)} />
            {activeAction === idx
              ? <CatchForm
                formData={catchItem}
                speciesList={species}
                sampleTypesList={sampleTypes}
                onSubmit={(updatedData) => handleEditCatch(idx, updatedData)}
              />
              : <CatchView
                catchDetails={catchItem}
                speciesList={species}
                sampleTypesList={sampleTypes} />
            }
          </AppCard>
        ))}
    </>
  );
};

export default CatchDetailPage;
