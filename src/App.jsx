import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Application } from "@nmfs-radfish/react-radfish";
import { AuthProvider } from "./context/AuthContext";
import AppInitStatusPage from "./pages/AppInitStatus";
import CruiseListPage from "./pages/CruiseList";
import CruiseNewPage from "./pages/CruiseNew";
import CruiseDetailPage from "./pages/CruiseDetail";
import StationDetailPage from "./pages/StationDetail";
import CatchDetailPage from "./pages/CatchDetail";
import SwitchAccounts from "./pages/SwitchAccounts";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import AuthenticatedApp from "./components/AuthenticatedApp";
import MainHeader from "./components/MainHeader";
import { GridContainer } from "@trussworks/react-uswds";

function App({ application }) {
  return (
    <Application application={application}>
      <main id="main-content">
        <BrowserRouter>
          <AuthProvider>
            <MainHeader />
            <div className="flex-justify-center">
              <GridContainer containerSize="tablet-lg">
                <Routes>
                  <Route path="/" element={<Login />} />
                   <Route path="/login" element={<Login />} />
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
                    <Route
                      path="/cruises/:cruiseId/station/:stationId/catch"
                      element={<CatchDetailPage />}
                    />
                    <Route path="switch-accounts" element={<SwitchAccounts />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </GridContainer>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
