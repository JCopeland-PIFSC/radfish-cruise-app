import { useState, useEffect } from "react";
import { Grid, Button } from "@trussworks/react-uswds";
import {
  AppCard,
  CatchView,
  CatchForm,
  HeaderWithEdit,
} from "../components";
import { useParams, useNavigate } from "react-router-dom";
import { useListTablesContext, useAuth, useCruisesAndStationsContext } from "../context";

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
  const { user } = useAuth();
  const { lists } = useListTablesContext();
  const { species, sampleTypes } = lists;
  const { loading: stationLoading, error: stationError, getStationById, getCruiseById, refreshStationsState } = useCruisesAndStationsContext();
  const { updateStation } = useCruiseAndStations();
  const { isStatusLocked } = false;// useCruiseStatusLock(cruiseId);
  const navigate = useNavigate();
  const [catches, setCatches] = useState([]);
  const [activeAction, setActiveAction] = useState(null);

  const cruise = getCruiseById(cruiseId);
  const station = getStationById(stationId);

  useEffect(() => {
    if (station?.catch) {
      setCatches(station.catch);
      if (station.catch.length === 0) {
        setActiveAction(CatchAction.NEW);
      }
    }
  }, [station]);

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
      refreshStationsState(user.id);
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
              disabled={activeAction !== null && activeAction !== CatchAction.NEW || isStatusLocked}
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
      {catches?.length
        ? catches.map((catchItem, idx) => (
          <AppCard key={idx}>
            <HeaderWithEdit
              title=""
              editLabel={"Catch"}
              actionCheck={idx}
              activeAction={activeAction}
              handleSetAction={() => setActiveAction(idx)}
              handleCancelAction={() => setActiveAction(null)}
              statusLock={isStatusLocked} />
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
        ))
        : (activeAction !== CatchAction.NEW && "No Catches Recorded")
      }
    </>
  );
};

export default CatchDetailPage;
