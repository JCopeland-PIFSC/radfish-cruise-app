// ListContext.js
import React, { createContext, useReducer } from "react";

// Define action types
const ACTIONS = {
  SET_PORTS_LIST: "SET_PORTS_LIST",
  SET_SPECIES_LIST: "SET_SPECIES_LIST",
  SET_PRECIPITATION_LIST: "SET_PRECIPITATION_LIST",
  SET_SAMPLE_TYPES_LIST: "SET_SAMPLE_TYPES_LIST",
  SET_CRUISE_STATUSES_LIST: "SET_CRUISE_STATUSES_LIST",
  SET_CRUISES_LIST: "SET_CRUISES_LIST",
};

// Initial state for the lists
const INITIAL_STATE = {
  ports: [],
  species: [],
  precipitation: [],
  sampleTypes: [],
  cruiseStatuses: [],
  cruisesLoading: true,
};

// Reducer to manage the state updates
function cruiseReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PORTS_LIST:
      return { ...state, ports: action.payload };
    case ACTIONS.SET_SPECIES_LIST:
      return { ...state, species: action.payload };
    case ACTIONS.SET_PRECIPITATION_LIST:
      return { ...state, precipitation: action.payload };
    case ACTIONS.SET_SAMPLE_TYPES_LIST:
      return { ...state, sampleTypes: action.payload };
    case ACTIONS.SET_CRUISE_STATUSES_LIST:
      return { ...state, cruiseStatuses: action.payload };
    case ACTIONS.SET_CRUISES_LIST:
      return { ...state, cruises: action.payload, cruisesLoading: false };
    case ACTIONS.SET_NEW_CRUISE:
      return {
        ...state,
        cruises: [action.payload, ...state.cruises],
        cruisesLoading: false,
      };
    default:
      return state;
  }
}

// Create context
const CruiseContext = createContext();

// Context provider component
function CruiseProvider({ children, initialState=INITIAL_STATE }) {
  const [state, dispatch] = useReducer(cruiseReducer, initialState);
  console.log('state: ', state)

  return (
    <CruiseContext.Provider value={{ state, dispatch }}>
      {children}
    </CruiseContext.Provider>
  );
}

export { CruiseContext, CruiseProvider, ACTIONS };
