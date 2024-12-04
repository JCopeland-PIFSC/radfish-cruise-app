import { useEffect, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";
import { get } from "../utils/requestMethods";

const HOUR_MS = 1000 * 60 * 60;

export const userDataKey = "userData";
export const cruiseTableName = "cruises";
export const stationTableName = "stations";

export const useLoadCruisesAndStations = (listTablesReady, isOffline) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(false); // Warn if cruises/stations are missing and offline

  const dbManager = DatabaseManager.getInstance();

  // Helper to fetch and store cruises/stations
  const fetchAndStoreTable = async (tableName) => {
    const fetchedData = await get(`/api/${tableName}`);
    const table = dbManager.db.table(tableName);

    await dbManager.db.transaction("rw", table, async () => {
      for (const newRecord of fetchedData) {
        const existingRecord = await table.get(newRecord.id); // Assume `id` is the primary key
        if (
          !existingRecord ||
          JSON.stringify(existingRecord) !== JSON.stringify(newRecord)
        ) {
          // Update only if the record is new or has changed
          await table.put(newRecord); // Adds new or updates existing record
        }
      }
    });
  };

  useEffect(() => {
    const initialize = async () => {
      if (!listTablesReady) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        if (isOffline) {
          // Check IndexedDB for cruises and stations
          const cruisesCount = await dbManager.db
            .table(cruiseTableName)
            .count();
          const stationsCount = await dbManager.db
            .table(stationTableName)
            .count();

          // Warn if offline and no cruises or stations
          if (cruisesCount === 0 || stationsCount === 0) {
            setWarning(true);
          }
        } else {
          // Online: Fetch and store cruises and stations
          await fetchAndStoreTable(cruiseTableName);
          await fetchAndStoreTable(stationTableName);
        }
      } catch (err) {
        setError(err);
        console.error("Error loading cruises and stations:", err);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [listTablesReady, isOffline, dbManager]);

  // React Query for caching
  const queries = useQueries({
    queries: [
      {
        queryKey: [userDataKey, cruiseTableName],
        queryFn: () => dbManager.getTableRecords(cruiseTableName, "-startDate"),
        staleTime: HOUR_MS,
        enabled: listTablesReady,
      },
      {
        queryKey: [userDataKey, stationTableName],
        queryFn: () => dbManager.getTableRecords(stationTableName),
        staleTime: HOUR_MS,
        enabled: listTablesReady,
      },
    ],
  });

  const cruiseQuery = queries[0];
  const stationQuery = queries[1];

  const cruises = cruiseQuery.data || [];
  const stations = stationQuery.data || [];
  const isError = cruiseQuery.isError || stationQuery.isError;
  const errorDetails = cruiseQuery.error || stationQuery.error;

  return {
    loading,
    warning,
    error,
    cruises,
    stations,
    isError,
    errorDetails,
  };
};
