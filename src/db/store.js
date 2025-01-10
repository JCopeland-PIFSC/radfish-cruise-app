import { IndexedDBMethod } from "@nmfs-radfish/radfish";

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
  users: "id, username, isAuthenticated",
  userCruises: "id",
};

export default new IndexedDBMethod(name, version, stores);

// A tableMetadata table is used to track when certain tables were last updated.
export const tablesMetadataTableName = "tablesMetadata";
