import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
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
        className={`header__menu-item--${isExpanded ? "expanded" : "collapsed"}`}
        onClick={closeMobileNav}
      >
        Cruises
      </Link>,
    ]
    : [];
  const accountItems = user?.username
    ? [
      <Link
        className="header__submenu-item"
        to="/app-status"
        key="one"
        onClick={closeMobileNav}
      >
        App Status
      </Link>,
      <Link
        className="header__submenu-item"
        to="/switch-accounts"
        key="two"
        onClick={closeMobileNav}
      >
        Switch Accounts
      </Link>,
      <p className="header__username" key="three">
        {user.username}
      </p>,
    ]
    : [];
  return (
    <Header
      basic={true}
      showMobileOverlay={isExpanded}
      className="header"
    >
      <div className="usa-nav-container">
        <div className="usa-navbar">
        <img
            src="logo.png"
            alt="RADFish Cruise App logo"
            style={{ width: "120px"}}
          />
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
