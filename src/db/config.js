// This config will contain DB configuration detail specific to the application
// This configuration follows the format used by the RADFish hook

export const name = import.meta.env.VITE_INDEXED_DB_NAME;
export const version = import.meta.env.VITE_INDEXED_DB_VERSION;
export const stores = {
  tablesMetadata: "tableName, lastUpdate",
  ports: "id, name",
  species: "id, name",
  precipitation: "id, description",
  sampleTypes: "id, name",
  cruiseStatuses: "id, name",
  cruises: "id, cruiseName, startDate",
  stations: "id, cruiseId, stationName",
  userCruises: "id",
};

export const store = new IndexedDBMethod(name, version, stores);

// A tableMetadata table is used to track when certain tables were last updated.
export const tablesMetadataTableName = "tablesMetadata";

const HOUR_MS = 1000 * 60 * 60;
const DAY_MS = HOUR_MS * 24;
const WEEK_MS = DAY_MS * 7;

export const tablesMetadataSeed = [
  {
    tableName: "ports",
    lastUpdate: null,
    updateThreshold: HOUR_MS * 1,
  },
  {
    tableName: "species",
    lastUpdate: null,
    updateThreshold: HOUR_MS * 1,
  },
  {
    tableName: "precipitation",
    lastUpdate: null,
    updateThreshold: HOUR_MS * 1,
  },
  {
    tableName: "sampleTypes",
    lastUpdate: null,
    updateThreshold: HOUR_MS * 1,
  },
  {
    tableName: "cruiseStatuses",
    lastUpdate: null,
    updateThreshold: HOUR_MS * 1,
  },
];
