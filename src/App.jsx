import "./index.css";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ListContext, LIST_ACTIONS } from './ListContext';
import { Application } from "@nmfs-radfish/react-radfish";
import {
  GridContainer,
  Title,
  NavMenuButton,
  PrimaryNav,
  Header,
} from "@trussworks/react-uswds";
import { get } from "./utils/requestMethods"
import CruiseListPage from "./pages/CruiseList";
const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [isExpanded, setExpanded] = useState(false);
  const { dispatch } = useContext(ListContext);

  async function fetchList(actionType, endpoint, queryParams) {
    const responseData = await get(endpoint, queryParams);
    dispatch({ type: actionType, payload: responseData });
  };

  useEffect(() => {
    // Fetch lists asynchronously
    fetchList(LIST_ACTIONS.SET_PORTS, `${API_BASE_URL}/ports`, { _sort: "name" });
    fetchList(LIST_ACTIONS.SET_CRUISE_STATUSES, `${API_BASE_URL}/cruiseStatuses`);
    fetchList(LIST_ACTIONS.SET_CRUISES, `${API_BASE_URL}/cruises`, { _sort: "-startDate" });
    fetchList(LIST_ACTIONS.SET_SPECIES, `${API_BASE_URL}/species`, { _sort: "name" });
    fetchList(LIST_ACTIONS.SET_SAMPLE_TYPES, `${API_BASE_URL}/sampleTypes`);
    fetchList(LIST_ACTIONS.SET_PRECIPITATION, `${API_BASE_URL}/precipitation`);

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
                <Title className="header-title">RADFish Application</Title>
                <NavMenuButton
                  onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
                  label="Menu"
                />
              </div>
              <PrimaryNav
                items={[
                  <Link
                    to="/cruise"
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
          <GridContainer>
            <Routes>
              <Route path="/" element={<Navigate to="/cruise" />} />
              <Route path="/cruise" element={<CruiseListPage />} />
            </Routes>
          </GridContainer>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
