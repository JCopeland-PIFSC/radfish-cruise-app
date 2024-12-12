import "./index.css";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
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
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AuthenticatedApp from "./components/AuthenticatedApp";

function App({ application }) {
  const [isExpanded, setExpanded] = useState(false);

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
              <AuthProvider>
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/*" element={<AuthenticatedApp />}>
                      <Route
                        path="app-init-status"
                        element={<AppInitStatusPage />}
                      />
                      <Route path="cruises" element={<CruiseListPage />} />
                      <Route path="cruises/new" element={<CruiseNewPage />} />
                      <Route
                        path="cruises/:cruiseId"
                        element={<CruiseDetailPage />}
                      />
                      <Route
                        path="cruises/:cruiseId/station/:stationId"
                        element={<StationDetailPage />}
                      />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </AuthProvider>
            </GridContainer>
          </div>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
