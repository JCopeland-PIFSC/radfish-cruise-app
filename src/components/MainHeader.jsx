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

  const closeMobileNav = () => {
    setExpanded(false);
  };

  const menuItems = user?.username
    ? [
        <Link
          to="/cruises"
          style={{ color: `${isExpanded ? "black" : "white"}` }}
          onClick={closeMobileNav}
        >
          Cruises
        </Link>,
      ]
    : [];
  const accountItems = user?.username
    ? [
        <Link
          className="text_color-white text_margin-bottom"
          to="/app-init-status"
          key="one"
          onClick={closeMobileNav}
        >
          App Status
        </Link>,
        <Link
          className="text_color-white"
          to="/switch-accounts"
          key="two"
          onClick={closeMobileNav}
        >
          Switch Accounts
        </Link>,
        <p className="text_username text_transform-capitalize" key="three">
          {user.username}
        </p>,
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
          {user?.username && (
            <NavMenuButton
              onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
              label="Menu"
            />
          )}
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
