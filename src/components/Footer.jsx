import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="footer"
    >
      <img
        src="radfish-logo.webp"
        alt="radfish logo"
        className="footer__logo"
      />
      <p className="footer__text">Built with <Link to="https://nmfs-radfish.github.io/radfish/">RADFish</Link></p>
    </footer>
  );
};

export default Footer;
