import { useEffect, useState } from "react";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { get, genListQueryParams } from "../utils/requestMethods";
import { useAuth } from "../context/AuthContext";

export const userDataKey = "userData";
export const userCruisesTableName = "userCruises";
export const cruiseTableName = "cruises";
export const stationTableName = "stations";

export const useLoadCruisesAndStations = (listTablesReady, isOffline) => {
  // Get db instance
  const { create, findOne, storageMethod } = useOfflineStorage();
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(false); // Warn if cruises/stations are missing and offline
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAndStoreUserCruises = async (userId) => {
    // Short circuit if not userId
    if (!userId) return [];

    const fetchedUserCruises = await get(
      `/api/${userCruisesTableName}`,
      `id=${userId}`,
    );
    //Only one record should have userId. Return only one record;
    // Short circuit if no userCruises
    if (!fetchedUserCruises?.length) return [];
    // if fetchedUserCruises are found just return the first record.
    const userCruises = fetchedUserCruises[0];
    // if fetched records does not exist locally, save it locally.
    const localRecord = await findOne(userCruisesTableName, {
      where: { id: userId },
    });

    if (!localRecord) await create(userCruisesTableName, userCruises);

    return userCruises?.cruises?.length ? userCruises.cruises : [];
  };

  // Helper to fetch and store cruises/stations
  const fetchAndStoreFilteredSet = async (tableName, key, setList) => {
    const queryParams = genListQueryParams(key, setList);
    const fetchedData = await get(`/api/${tableName}`, queryParams);
    const table = storageMethod.db.table(tableName);

    // if fetched records does not exist locally, save it locally.
    await storageMethod.db.transaction("rw", table, async () => {
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
          const cruisesCount = await storageMethod.db
            .table(cruiseTableName)
            .count();
          const stationsCount = await storageMethod.db
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
  }, [listTablesReady, isOffline, user]);

  return {
    loading,
    warning,
    error,
  };
};
