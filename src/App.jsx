import "./index.css";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [isExpanded, setExpanded] = useState(false);
  const [cruiseList, setCruiseList] = useState([]);
  const [portsList, setPortsList] = useState([]);
  const [cruiseStatusList, setCruiseStatusList] = useState([]);
  
  // Fetch Cruises
  useEffect(() => {
    const api_url = `${API_BASE_URL}/cruises`
    const params = { _sort: "-startDate" };

    const fetchCruises = async () => {
      const data = await get(api_url, params);
      setCruiseList(data);
    }

    fetchCruises();
  }, [])

  // Fetch Ports
  useEffect(() => {
    const api_url = `${API_BASE_URL}/ports`

    const fetchPorts = async () => {
      const data = await get(api_url);
      setPortsList(data);
    }

    fetchPorts();
  }, [])

  // Fetch CruiseStatuses
  useEffect(() => {
    const api_url = `${API_BASE_URL}/cruiseStatuses`

    const fetchCruiseStatuses = async () => {
      const data = await get(api_url);
      setCruiseStatusList(data);
    }

    fetchCruiseStatuses();
  }, [])

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
              <Route path="/cruise" element={
                <CruiseListPage
                  cruiseList={cruiseList}
                  portsList={portsList}
                  cruiseStatusList={cruiseStatusList}
                />} />
            </Routes>
          </GridContainer>
        </BrowserRouter>
      </main>
    </Application>
  );
}

export default App;
