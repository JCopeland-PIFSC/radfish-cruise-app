import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Title,
  NavMenuButton,
  ExtendedNav,
  Header,
} from "@trussworks/react-uswds";

const MainHeader = () => {
  const [isExpanded, setExpanded] = useState(false);
  const { user } = useAuth();
  return (
    <Header
      basic={true}
      showMobileOverlay={isExpanded}
      className="header-container"
    >
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title className="header-title">
            RADFish Cruise App
            <span className="header-username"> -- {user?.username}</span>
          </Title>
          <NavMenuButton
            onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
            label="Menu"
          />
        </div>
        <ExtendedNav
          primaryItems={[
            <Link
              to="/cruises"
              style={{ color: `${isExpanded ? "black" : "white"}` }}
            >
              Cruises
            </Link>,
          ]}
          secondaryItems={[<Link to="/switch-accounts">Switch Accounts</Link>]}
          mobileExpanded={isExpanded}
          onToggleMobileNav={() => setExpanded((prvExpanded) => !prvExpanded)}
        ></ExtendedNav>
      </div>
    </Header>
  );
};

export default MainHeader;
