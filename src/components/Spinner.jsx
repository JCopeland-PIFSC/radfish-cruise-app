import React from "react";
import { Spinner as RadfishSpinner } from "@nmfs-radfish/react-radfish";

const Spinner = ({ message, fillViewport = false }) => {
  return (
    <div
      className={`display-flex flex-column flex-justify-center flex-align-center ${
        fillViewport ? "height-viewport" : ""
      }`}
    >
      {message && <p>{message}</p>}
      <RadfishSpinner width={50} height={50} stroke={8} />
    </div>
  );
};

export default Spinner;
