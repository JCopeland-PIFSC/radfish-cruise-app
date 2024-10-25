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

const API_BASE_URL = "http://localhost:5000";

function App() {
  const [isExpanded, setExpanded] = useState(false);
  const { dispatch } = useContext(CruiseContext);

  async function fetchList(actionType, endpoint, queryParams) {
    const responseData = await get(endpoint, queryParams);
    dispatch({ type: actionType, payload: responseData });
  }

  async function fetchCruiseDetails(id) {
    return await get(`${API_BASE_URL}/cruises/${id}`);
  }

  async function fetchCruiseStations(id) {
    return await get(`${API_BASE_URL}/stations`, { cruiseId: id });
  }

  function CruiseLoaderWrapper() {
    const { id } = useParams();
    const [cruise, setCruise] = useState(null);
    const [stations, setStations] = useState(null);

    useEffect(() => {
      const load = async () => {
        const cruiseRes = await fetchCruiseDetails(id);
        const stationsRes = await fetchCruiseStations(id);
        setCruise(cruiseRes);
        setStations(stationsRes);
      };

      load();
    }, [id]);

    if (!cruise || !stations) return <div>Loading...</div>;

    return <CruiseDetailPage data={{ cruise, stations }} />;
  }

  useEffect(() => {
    // Fetch lists asynchronously
    fetchList(ACTIONS.SET_PORTS_LIST, `${API_BASE_URL}/ports`, {
      _sort: "name",
    });
    fetchList(
      ACTIONS.SET_CRUISE_STATUSES_LIST,
      `${API_BASE_URL}/cruiseStatuses`,
    );
    fetchList(ACTIONS.SET_CRUISES_LIST, `${API_BASE_URL}/cruises`, {
      _sort: "-startDate",
    });
    fetchList(ACTIONS.SET_SPECIES_LIST, `${API_BASE_URL}/species`, {
      _sort: "name",
    });
    fetchList(ACTIONS.SET_SAMPLE_TYPES_LIST, `${API_BASE_URL}/sampleTypes`);
    fetchList(ACTIONS.SET_PRECIPITATION_LIST, `${API_BASE_URL}/precipitation`);
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
          <Routes>
            <Route path="/" element={<Navigate to="/cruises" />} />
            <Route path="/cruises" element={<CruiseListPage />} />
            <Route path="/cruises/new" element={<CruiseNewPage />} />
            <Route path="/cruises/:id" element={<CruiseLoaderWrapper />} />
          </Routes>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
