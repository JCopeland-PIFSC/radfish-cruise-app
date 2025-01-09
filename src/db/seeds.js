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
