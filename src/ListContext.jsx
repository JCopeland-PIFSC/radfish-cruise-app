// ListContext.js
import React, { createContext, useReducer } from 'react';

// Define action types
const LIST_ACTIONS = {
  SET_PORTS: 'SET_PORTS',
  SET_SPECIES: 'SET_SPECIES',
  SET_PRECIPITATION: 'SET_PRECIPITATION',
  SET_SAMPLE_TYPES: 'SET_SAMPLE_TYPES',
  SET_CRUISE_STATUSES: 'SET_CRUISE_STATUSES',
  SET_CRUISES: 'SET_CRUISES',
};

// Initial state for the lists
const initialState = {
  ports: [],
  species: [],
  precipitation: [],
  sampleTypes: [],
  cruiseStatuses: [],
  cruisesLoading: true,
};

// Reducer to manage the state updates
function listReducer(state, action) {
  switch (action.type) {
    case LIST_ACTIONS.SET_PORTS:
      return { ...state, ports: action.payload };
    case LIST_ACTIONS.SET_SPECIES:
      return { ...state, species: action.payload };
    case LIST_ACTIONS.SET_PRECIPITATION:
      return { ...state, precipitation: action.payload };
    case LIST_ACTIONS.SET_SAMPLE_TYPES:
      return { ...state, sampleTypes: action.payload };
    case LIST_ACTIONS.SET_CRUISE_STATUSES:
      return { ...state, cruiseStatuses: action.payload };
    case LIST_ACTIONS.SET_CRUISES:
      return { ...state, cruises: action.payload, cruisesLoading: false };
    default:
      return state;
  }
}

// Create context
const ListContext = createContext();

// Context provider component
function ListProvider({ children }) {
  const [state, dispatch] = useReducer(listReducer, initialState);

  return (
    <ListContext.Provider value={{ state, dispatch }}>
      {children}
    </ListContext.Provider>
  );
}

export { ListContext, ListProvider, LIST_ACTIONS };
