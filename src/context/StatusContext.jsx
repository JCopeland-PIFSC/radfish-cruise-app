import React, { createContext, useContext, useState } from "react";

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [statusData, setStatusData] = useState({
    statuses: null,
    listsLoading: false,
    isListsError: false,
    listsErrorMessage: "",
    cruisesWarning: false,
  });

  return (
    <StatusContext.Provider value={{ statusData, setStatusData }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext);