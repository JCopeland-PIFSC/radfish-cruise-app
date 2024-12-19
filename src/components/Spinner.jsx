import React from "react";
import { Spinner as RadfishSpinner } from "@nmfs-radfish/react-radfish";

const Spinner = () => {
  return (
    <div className="display-flex flex-justify-center flex-align-center height-viewport">
      <RadfishSpinner width={50} height={50} stroke={8} />;
    </div>
  );
};

export default Spinner;
