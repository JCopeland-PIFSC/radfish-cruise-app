import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";
import { get } from "../utils/requestMethods";
import { useAuth } from "../context/AuthContext";

const HOUR_MS = 1000 * 60 * 60;
const DISABLE = 0;

export const userDataKey = "userData";
export const userCruisesTableName = "userCruises";
export const cruiseTableName = "cruises";
export const stationTableName = "stations";

export const useLoadCruisesAndStations = (listTablesReady, isOffline) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(false); // Warn if cruises/stations are missing and offline
  const { user } = useAuth();
  const dbManager = DatabaseManager.getInstance();

  const fetchAndStoreUserCruises = async (userId) => {
    // Short circuit if not userId
    if (!userId) return [];

    const fetchedUserCruises = await get(
      `/api/${userCruisesTableName}`,
      `id=${userId}`,
    ); //Only one record should have userId. Return only one record;
    // Short circuit if no userCruises
    if (!fetchedUserCruises?.length) return [];
    // if fetchedUserCruises are  found just return the first record.
    const userCruises = fetchedUserCruises[0];
    const table = dbManager.db.table(userCruisesTableName);

    // if fetched records does not exist locally, save it locally.
    const localRecord = await table.get(userCruises.id);
    if (!localRecord) {
      await table.put(userCruises);
    }

    const { cruises } = userCruises;
    return cruises?.length ? cruises : [];
  };

  // Helper to fetch and store cruises/stations
  const fetchAndStoreFilteredSet = async (tableName, key, setList) => {
    const queryParams = genListQueryParam(key, setList);
    const fetchedData = await get(`/api/${tableName}`, queryParams);
    const table = dbManager.db.table(tableName);

    // if fetched records does not exist locally, save it locally.
    await dbManager.db.transaction("rw", table, async () => {
      for (const fetchedRecord of fetchedData) {
        const localRecord = await table.get(fetchedRecord.id);
        if (!localRecord) {
          await table.put(fetchedRecord);
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
          const userCruises = await fetchAndStoreUserCruises(user?.id);

          // Only attempt fetchAndStore if authorized user has userCruises
          if (userCruises?.length) {
            await fetchAndStoreFilteredSet(cruiseTableName, "id", userCruises);
            await fetchAndStoreFilteredSet(
              stationTableName,
              "cruiseId",
              userCruises,
            );
          } else {
            setWarning(true);
          }
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
        enabled: listTablesReady,
      },
      {
        queryKey: [userDataKey, stationTableName],
        queryFn: () => dbManager.getTableRecords(stationTableName),
        enabled: listTablesReady,
      },
      {
        queryKey: [userDataKey, "users"],
        queryFn: () => dbManager.getTableRecords("users"),
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

function genListQueryParam(keyName, keyList) {
  let paramStr = "";
  for (const key of keyList) {
    paramStr = paramStr.concat(`${keyName}=${key}&`);
  }
  return paramStr;
}
