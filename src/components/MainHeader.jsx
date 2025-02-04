import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Title,
  NavMenuButton,
  ExtendedNav,
  Header,
  Icon,
} from "@trussworks/react-uswds";

const MainHeader = () => {
  const [isExpanded, setExpanded] = useState(false);
  const { user } = useAuth();

  const closeMobileNav = () => {
    setExpanded(false);
  };

  const getNavItemClass = ({ isActive }) =>
    isActive ? "header__submenu-item text-bold" : "header__submenu-item";

  const accountItems = user?.username
    ? [
        <NavLink
          to="/cruises"
          key="one"
          onClick={closeMobileNav}
          className={getNavItemClass}
        >
          Cruises
        </NavLink>,

        <NavLink
          to="/app-status"
          key="two"
          onClick={closeMobileNav}
          className={getNavItemClass}
        >
          App Status
        </NavLink>,

        <NavLink
          to="/switch-accounts"
          key="three"
          onClick={closeMobileNav}
          className={({ isActive }) =>
            isActive
              ? "nav-link-with-icon text-bold header__submenu-item"
              : "nav-link-with-icon header__submenu-item"
          }
        >
          <Icon.AccountCircle size={3} />
          {user?.username}
        </NavLink>,
      ]
    : [];

  return (
    <Header
      basic={true}
      showMobileOverlay={isExpanded}
      className="header z-top"
    >
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title>
            <img
              src="/logo.png"
              alt="RADFish Cruise App logo"
              className="header-logo"
            />
          </Title>
          {user?.username && (
            <NavMenuButton
              onClick={() => setExpanded((prevExpanded) => !prevExpanded)}
              label="Menu"
            />
          )}
        </div>
        <ExtendedNav
          primaryItems={[]}
          secondaryItems={accountItems}
          mobileExpanded={isExpanded}
          onToggleMobileNav={() => setExpanded((prevExpanded) => !prevExpanded)}
        />
      </div>
    </Header>
  );
};

export default MainHeader;
