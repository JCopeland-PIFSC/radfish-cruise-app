import { useState, useEffect } from "react";
import { Grid, GridContainer, Button } from "@trussworks/react-uswds";
import {
  AppCard,
  CatchView,
  CatchForm,
  HeaderWithEdit,
  GoBackButton,
} from "../components";
import { useParams, useNavigate } from "react-router-dom";
import {
  useListTablesContext,
  useAuth,
  useCruisesAndStationsContext,
} from "../context";

const CatchAction = {
  NEW: "NEW",
  EDIT: "EDIT",
};

const InitializedCatch = {
  speciesId: "",
  aggregateWeightKg: "",
  individuals: [],
};

const CatchDetailPage = () => {
  const { cruiseId, stationId } = useParams();
  const { user } = useAuth();
  const { lists } = useListTablesContext();
  const { species, sampleTypes } = lists;
  const {
    loading: stationLoading,
    error: stationError,
    getStationById,
    getCruiseById,
    refreshStationsState,
    updateStation,
    useCruiseStatusLock,
  } = useCruisesAndStationsContext();
  const { isStatusLocked } = useCruiseStatusLock(cruiseId);
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
  if (stationError)
    return <div>Error Loading Station Data: {errorStation?.message}</div>;

  const { cruiseName } = cruise;
  const { stationName } = station;

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
        idx === index ? { ...item, ...updatedCatch } : item,
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
    <GridContainer className="usa-section">
      <Grid row className="margin-top-2">
        <GoBackButton
          to={`/cruises/${cruiseId}`}
          label={`Cruise: ${cruiseName || ""}`}
        />
      </Grid>
      <Grid row className="flex-justify margin-top-2">
        <h1 className="app-sec-header">Station: {stationName.toUpperCase()}</h1>
      </Grid>
      <Grid row className="flex-justify flex-align-center margin-bottom-1  margin-top-5 gap-10">
        <h2 className="app-sec-header">Catches</h2>
        {activeAction === CatchAction.NEW ? (
          <Button
            className="margin-right-0"
            onClick={() => setActiveAction(null)}
            secondary
          >
            Cancel New Catch
          </Button>
        ) : (
          <Button
            className="margin-right-0"
            onClick={() => setActiveAction(CatchAction.NEW)}
            disabled={
              (activeAction !== null && activeAction !== CatchAction.NEW) ||
              isStatusLocked
            }
          >
            Add New Catch
          </Button>
        )}
      </Grid>
      {activeAction === CatchAction.NEW && (
        <AppCard className="position-relative margin-bottom-6">
          <CatchForm
            formData={structuredClone(InitializedCatch)}
            speciesList={species}
            sampleTypesList={sampleTypes}
            onSubmit={handleNewCatch}
          />
        </AppCard>
      )}
      {catches?.length
        ? catches.map((catchItem, idx) => (
            <AppCard key={idx} className="position-relative margin-bottom-6">
              <HeaderWithEdit
                title=""
                editLabel={"Catch"}
                actionCheck={idx}
                activeAction={activeAction}
                handleSetAction={() => setActiveAction(idx)}
                handleCancelAction={() => setActiveAction(null)}
                statusLock={isStatusLocked}
              />
              {activeAction === idx ? (
                <CatchForm
                  formData={catchItem}
                  speciesList={species}
                  sampleTypesList={sampleTypes}
                  onSubmit={(updatedData) => handleEditCatch(idx, updatedData)}
                />
              ) : (
                <CatchView
                  catchDetails={catchItem}
                  speciesList={species}
                  sampleTypesList={sampleTypes}
                />
              )}
            </AppCard>
          ))
        : activeAction !== CatchAction.NEW && (
            <AppCard>No Catches Recorded</AppCard>
          )}
    </GridContainer>
  );
};

export default CatchDetailPage;
