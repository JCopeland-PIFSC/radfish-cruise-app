import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useParams,
} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CruiseContext, ACTIONS } from "./CruiseContext";
import { Application } from "@nmfs-radfish/react-radfish";
import {
  GridContainer,
  Title,
  NavMenuButton,
  PrimaryNav,
  Header,
} from "@trussworks/react-uswds";
import { get } from "./utils/requestMethods";
import CruiseListPage from "./pages/CruiseList";
import CruiseNewPage from "./pages/CruiseNew";
import CruiseDetailPage from "./pages/CruiseDetail";
import StationDetailPage from "./pages/StationDetail";

function App() {
  const [isExpanded, setExpanded] = useState(false);
  const { dispatch } = useContext(CruiseContext);

  async function fetchList(actionType, endpoint, queryParams) {
    const responseData = await get(endpoint, queryParams);
    dispatch({ type: actionType, payload: responseData });
  }

  async function fetchCruiseDetails(id) {
    return await get(`/api/cruises/${id}`);
  }

  async function fetchCruiseStations(id) {
    return await get(`/api/stations`, { cruiseId: id, _sort: "-events.beginSet.timestamp", });
  }

  async function fetchStation(id) {
    return await get(`/api/stations/${id}`);
  }

  function CruiseLoaderWrapper() {
    const { id } = useParams();
    const [cruise, setCruise] = useState(null);
    const [stations, setStations] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    // Validate and Initialize Core Tables
    const initializeCoreTables = async () => {
      const emptyCoreTablesList = await dbManager.getEmptyCoreTablesList();

      if (isOffline) {
        console.log('Offline');
        if (!emptyCoreTablesList || !emptyCoreTablesList.length) {
          // App cannot be used because it is not initialized
          setCoreTablesReady(false);
        } else {
          setCoreTablesReady(true);
        }
      } else {
        console.log('Online');
        const updateCoreTablesList = await dbManager.getUpdateCoreTablesList();

        if (updateCoreTablesList && updateCoreTablesList.length) {
          try {
            const now = new Date();
            const tablePromises = updateCoreTablesList.map(async (tableName) => {
              if (signal.aborted) return; // Abort if the signal is triggered.
              try {
                // Fetch data for each table
                const fetchedTable = await get(`/api/${tableName}`);
                await dbManager.db.transaction('rw', [tableName, dbManager.tablesMetadata], async () => {
                  // Update the table with fetched data.
                  await dbManager.db.table(tableName).clear();
                  await dbManager.db.table(tableName).bulkAdd(fetchedTable);
                  // Update the metadata for the table
                  await dbManager.db.table(dbManager.tablesMetadata).update(tableName, { lastUpdate: now });
                });
              } catch (error) {
                if (!signal.aborted) console.error(`Error processing table ${tableName}:`, error);
              }
            });

            // Wait for all table promises to complete
            await Promise.all(tablePromises);
            if (!signal.aborted) {
              // Successfully finished updating tables
              setCoreTablesReady(true);
            }
          } catch (error) {
            if (!signal.aborted) {
              console.error("Error initializing tables:", error);
              setCoreTablesReady(false);
            }
          }
        }
      }
    };

    initializeCoreTables();

    return () => {
      controller.abort();
    };
  }, [isOffline]);

      load();
    }, [cruiseId, stationId]);

    if (!cruise || !station) return <div>Loading...</div>;

    return <StationDetailPage data={{ cruiseName: cruise?.cruiseName, station }} />;
  }

  useEffect(() => {
    // Fetch lists asynchronously
    fetchList(ACTIONS.SET_PORTS_LIST, `/api/ports`, {
      _sort: "name",
    });
    fetchList(
      ACTIONS.SET_CRUISE_STATUSES_LIST,
      `/api/cruiseStatuses`,
    );
    fetchList(ACTIONS.SET_CRUISES_LIST, `/api/cruises`, {
      _sort: "-startDate",
    });
    fetchList(ACTIONS.SET_SPECIES_LIST, `/api/species`, {
      _sort: "name",
    });
    fetchList(ACTIONS.SET_SAMPLE_TYPES_LIST, `/api/sampleTypes`);
    fetchList(ACTIONS.SET_PRECIPITATION_LIST, `/api/precipitation`);
  }, [dispatch]);

  return (
    <Application>
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <main id="main-content">
        <BrowserRouter>
          <Header
            basic={true}
            showMobileOverlay={isExpanded}
            className="header-container"
          >
            <div className="usa-nav-container">
              <div className="usa-navbar">
                <Title className="header-title">RADFish Cruise App</Title>
                <NavMenuButton
                  onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
                  label="Menu"
                />
              </div>
              <PrimaryNav
                items={[
                  <Link
                    to="/cruises"
                    style={{ color: `${isExpanded ? "black" : "white"}` }}
                  >
                    Cruises
                  </Link>,
                ]}
                mobileExpanded={isExpanded}
                onToggleMobileNav={() =>
                  setExpanded((prvExpanded) => !prvExpanded)
                }
              ></PrimaryNav>
            </div>
          </Header>
          {/* <div className="display-flex flex-justify-center"> */}
          <GridContainer containerSize="tablet-lg">
            <Routes>
              <Route path="/" element={<Navigate to="/cruises" />} />
              <Route path="/cruises" element={<CruiseListPage />} />
              <Route path="/cruises/new" element={<CruiseNewPage />} />
              <Route path="/cruises/:id" element={<CruiseLoaderWrapper />} />
              <Route path="/cruises/:cruiseId/station/:stationId" element={<StationLoaderWrapper />} />

              {/* Catch-all route for unknown paths */}
              <Route path="*" element={<Navigate to="/cruises" />} />
            </Routes>
          </GridContainer>
          {/* </div> */}
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
