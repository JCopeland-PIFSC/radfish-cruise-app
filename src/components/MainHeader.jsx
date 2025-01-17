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
  const menuItems = [
    <Link to="/cruises" style={{ color: `${isExpanded ? "black" : "white"}` }}>
      Cruises
    </Link>,
  ];
  const accountItems = user?.username
    ? [
      <p className="text_transform-capitalize" key="one">
        {user.username}
      </p>,
      <Link
        className="text_color-white"
        to="/switch-accounts"
        key="two"
      >
        Switch Accounts
      </Link>,
      <Link
        className="text_color-white"
        to="/app-init-status"
        key="three"
      >
        App Init Status
      </Link>,
    ]
    : [];
  return (
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
        <ExtendedNav
          primaryItems={menuItems}
          secondaryItems={accountItems}
          mobileExpanded={isExpanded}
          onToggleMobileNav={() => setExpanded((prvExpanded) => !prvExpanded)}
        ></ExtendedNav>
      </div>
    </Header>
  );
};

export default MainHeader;
