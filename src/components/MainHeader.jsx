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

  const accountItems = user?.username
    ? [
        <Link
          className="header__submenu-item"
          to="/cruises"
          key="one"
          onClick={closeMobileNav}
        >
          Cruises
        </Link>,
        <Link
          className="header__submenu-item"
          to="/app-status"
          key="two"
          onClick={closeMobileNav}
        >
          App Status
        </Link>,
        <Link
          className="header__username"
          to="/switch-accounts"
          key="three"
          onClick={closeMobileNav}
        >
          {user?.username}
        </Link>,
      ]
    : [];
  return (
    <Header basic={true} showMobileOverlay={isExpanded} className="header z-top">
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title>
            <img
              src="logo.png"
              alt="RADFish Cruise App logo"
              style={{ width: "120px" }}
            />
          </Title>
          {user?.username && (
            <NavMenuButton
              onClick={() => setExpanded((prvExpanded) => !prvExpanded)}
              label="Menu"
            />
          )}
        </div>
        <ExtendedNav
          primaryItems={[]}
          secondaryItems={accountItems}
          mobileExpanded={isExpanded}
          onToggleMobileNav={() => setExpanded((prvExpanded) => !prvExpanded)}
        ></ExtendedNav>
      </div>
    </Header>
  );
};

export default MainHeader;
