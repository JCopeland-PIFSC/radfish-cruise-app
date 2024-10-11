import "./index.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

import HomePage from "./pages/Home";


function App() {
  const [isExpanded, setExpanded] = useState(false);
  const [cruiseList, setCruiseList] = useState([]);
  const [portsList, setPortsList] = useState([]);
  const [cruiseStatusList, setCruiseStatusList] = useState([]);
  const API_BASE_URL = 'http://localhost:5000';
  // Fetch Cruises
  useEffect(() => {
    const API_URL = `${API_BASE_URL}/cruises`
    const params = { _sort: "-startDate" };

    const fetchCruises = async () => {
      const data = await get(API_URL, params);
      setCruiseList(data);
    }

    fetchCruises();
  }, [])

  // Fetch Ports
  useEffect(() => {
    const API_URL = `${API_BASE_URL}/ports`

    const fetchCruises = async () => {
      const data = await get(API_URL);
      setPortsList(data);
    }

    fetchCruises();
  }, [])

  // Fetch CruiseStatuses
  useEffect(() => {
    const API_URL = `${API_BASE_URL}/cruiseStatuses`

    const fetchCruises = async () => {
      const data = await get(API_URL);
      setCruiseStatusList(data);
    }

    fetchCruises();
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
                    to="/"
                    style={{ color: `${isExpanded ? "black" : "white"}` }}
                  >
                    Home
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
              <Route path="/" element={
                <HomePage
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
