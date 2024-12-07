import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
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
import AppInitStatusPage from "./pages/AppInitStatus";
import CruiseListPage from "./pages/CruiseList";
import CruiseNewPage from "./pages/CruiseNew";
import CruiseDetailPage from "./pages/CruiseDetail";
import StationDetailPage from "./pages/StationDetail";
import { useInitializeAndCacheListTables } from "./hooks/useInitializeAndCacheListTables";
import { useLoadCruisesAndStations } from "./hooks/useLoadCruisesAndStations";
function App({ application }) {
  const [isExpanded, setExpanded] = useState(false);

  // hooks
  const { isOffline } = useOfflineStatus();
  const {
    isReady,
    isLoading,
    isError,
    error,
  } = useInitializeAndCacheListTables(isOffline);
  const {
    loading: cruisesLoading,
    warning: cruisesWarning,
    error: cruisesError,
  } = useLoadCruisesAndStations(isReady, isOffline);

  // Statuses for the status page
  const statuses = {
    "Network Status": isOffline ? "red" : "green",
    "List Tables Initialized": isReady ? "green" : "yellow",
    "Cruises & Stations Loaded": cruisesLoading
      ? "yellow"
      : cruisesError
        ? "red"
        : "green",
  };

  return (
    <Application application={application}>
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
          <div className="flex-justify-center">
            <GridContainer containerSize="tablet-lg">
              <Routes>
                <Route
                  path="/"
                  element={
                    <AppInitStatusPage
                      statuses={statuses}
                      listsLoading={isLoading}
                      listsError={isError}
                      listsErrorMessage={error?.message}
                      additionalWarning={cruisesWarning &&
                        "Cruises or stations are missing. Please connect to the network if you suspect data is incomplete."}
                    />
                  }
                />
                <Route path="/cruises" element={<CruiseListPage />} />
                <Route path="/cruises/new" element={<CruiseNewPage />} />
                <Route path="/cruises/:cruiseId" element={<CruiseDetailPage />} />
                <Route path="/cruises/:cruiseId/station/:stationId" element={<StationDetailPage />} />
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