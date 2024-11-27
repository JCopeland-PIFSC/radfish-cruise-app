import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useParams,
} from "react-router-dom";
import { useState } from "react";
import { Application, useOfflineStatus } from "@nmfs-radfish/react-radfish";
import {
  GridContainer,
  Title,
  NavMenuButton,
  PrimaryNav,
  Header,
} from "@trussworks/react-uswds";
import CoreStatusPage from "./pages/CoreStatus";
import CruiseListPage from "./pages/CruiseList";
import CruiseNewPage from "./pages/CruiseNew";
import CruiseDetailPage from "./pages/CruiseDetail";
import StationDetailPage from "./pages/StationDetail";
import DatabaseManager from "./utils/DatabaseManager";
import { useInitializeAndCacheCoreTables } from "./hooks/useInitializeAndCacheCoreTables";
import { useLoadCruisesAndStations } from "./hooks/useLoadCruisesAndStations";
function App() {
  const [isExpanded, setExpanded] = useState(false);

  // hooks
  const { isOffline } = useOfflineStatus();
  const dbManager = DatabaseManager.getInstance();
  const {
    data,
    isReady,
    isLoading,
    isError,
    error,
  } = useInitializeAndCacheCoreTables(isOffline);
  const {
    loading: cruisesLoading,
    warning: cruisesWarning,
    error: cruisesError,
    cruises,
    stations,
  } = useLoadCruisesAndStations(isReady, isOffline);

  // Statuses for the status page
  const statuses = {
    "Network Status": isOffline ? "red" : "green",
    "Core Tables Initialized": isReady ? "green" : "yellow",
    "Cruises & Stations Loaded": cruisesLoading
      ? "yellow"
      : cruisesError
        ? "red"
        : "green",
  };

  return (
    <Application>
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
          <div className="display-flex flex-justify-center">
            <GridContainer containerSize="tablet-lg">
              <Routes>
                <Route
                  path="/"
                  element={
                    <CoreStatusPage
                      statuses={statuses}
                      coreLoading={isLoading}
                      coreError={isError}
                      coreErrorMessage={error?.message}
                      additionalWarning={cruisesWarning &&
                        "Cruises or stations are missing. Please connect to the network if you suspect data is incomplete."}
                    />
                  }
                />
                <Route path="/cruises" element={<CruiseListPage />} />
                <Route path="/cruises/new" element={<CruiseNewPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </GridContainer>
          </div>
        </BrowserRouter>
      </main>
    </Application>
  );
};

export default App;