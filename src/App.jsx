import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Application } from "@nmfs-radfish/react-radfish";
import {
  AuthProvider,
  ListTablesProvider,
  CruisesAndStationsProvider,
} from "./context";
import {
  AppStatus,
  CatchDetail,
  CruiseDetail,
  CruiseList,
  CruiseNew,
  Login,
  StationDetail,
  SwitchAccounts,
} from "./pages";
import { AuthenticatedApp, MainHeader, Footer } from "./components";

function App({ application }) {
  return (
    <Application application={application}>
      <div className="app-container">
        <BrowserRouter>
          <AuthProvider>
            <ConditionalHeader />
            <main
              id="main-content"
              className="bg-primary-darker text-white padding-top-6 padding-bottom-10"
            >
              <Routes>
                <Route path="/" element={<SwitchAccounts />} />
                <Route path="/switch-accounts" element={<SwitchAccounts />} />
                <Route path="/login" element={<Login />} />
                <Route
                  element={
                    <ListTablesProvider>
                      <CruisesAndStationsProvider>
                        <AuthenticatedApp />
                      </CruisesAndStationsProvider>
                    </ListTablesProvider>
                  }
                >
                  <Route path="/app-status" element={<AppStatus />} />
                  <Route path="/cruises" element={<CruiseList />} />
                  <Route path="/cruises/new" element={<CruiseNew />} />
                  <Route path="/cruises/:cruiseId" element={<CruiseDetail />} />
                  <Route
                    path="/cruises/:cruiseId/station/:stationId"
                    element={<StationDetail />}
                  />
                  <Route
                    path="/cruises/:cruiseId/station/:stationId/catch"
                    element={<CatchDetail />}
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <ConditionalFooter />
          </AuthProvider>
        </BrowserRouter>
      </div>
    </Application>
  );
}

function ConditionalHeader() {
  const location = useLocation();
  return location.pathname !== "/login" ? <MainHeader /> : null;
}

function ConditionalFooter() {
  const location = useLocation();
  return location.pathname !== "/login" ? <Footer /> : null;
}

export default App;
