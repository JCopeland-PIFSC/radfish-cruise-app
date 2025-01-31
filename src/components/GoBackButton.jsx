import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@trussworks/react-uswds";

const GoBackButton = ({ to, label }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(to);
  };

  return (
    <div onClick={handleGoBack} className="go-back-button">
      <Icon.ArrowBack size={2} aria-label={`Back to ${label}`} />
      Go Back to {label}
    </div>
  );
};

export default GoBackButton;
