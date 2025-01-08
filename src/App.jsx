import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GridContainer } from "@trussworks/react-uswds";
import { Application } from "@nmfs-radfish/react-radfish";
import { AuthProvider } from "./context/AuthContext";
import {
  AppInitStatus,
  CatchDetail,
  CruiseDetail,
  CruiseList,
  CruiseNew,
  Login,
  StationDetail,
  SwitchAccounts,
} from "./pages";
import {
  PrivateRoute,
  AuthenticatedApp,
  MainHeader,
} from "./components";

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
                  <Route path="/" element={<SwitchAccounts />} />
                  <Route path="/switch-accounts" element={<SwitchAccounts />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/app-init-status" element={<AppInitStatus />} />
                  <Route element={<PrivateRoute />}>
                    <Route path="/*" element={<AuthenticatedApp />}>
                      <Route path="cruises" element={<CruiseList />} />
                      <Route path="cruises/new" element={<CruiseNew />} />
                      <Route
                        path="cruises/:cruiseId"
                        element={<CruiseDetail />}
                      />
                      <Route
                        path="cruises/:cruiseId/station/:stationId"
                        element={<StationDetail />}
                      />
                    </Route>
                    <Route
                      path="/cruises/:cruiseId/station/:stationId/catch"
                      element={<CatchDetail />}
                    />
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
