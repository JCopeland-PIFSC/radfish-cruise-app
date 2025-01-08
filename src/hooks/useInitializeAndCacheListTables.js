import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { get } from "../utils/requestMethods";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import {
  tablesMetadataName,
  listTablesNamesList,
  getEmptyListTablesList,
  getUpdateListTablesList,
} from "../utils/databaseHelpers";

const HOUR_MS = 1000 * 60 * 60;
export const listDataKey = "listTableData";

export const useInitializeAndCacheListTables = (isOffline) => {
  // Get db instance
  const { find, storageMethod } = useOfflineStorage();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [listTablesReady, setListTablesReady] = useState(false);

  const sortByNameList = ["ports", "species", "sampleType"];

  // Step 1: Initialize list tables
  useEffect(() => {
    const initialize = async () => {
      // Set Loading and Error state for database updates.
      setIsLoading(true);
      setIsError(false);

      try {
        const emptyTables = await getEmptyListTablesList();
        if (isOffline && emptyTables?.length) {
          // Offline and tables are not initialized
          throw new Error("Offline and list tables are uninitialized.");
        } else if (!isOffline) {
          const updateTables = await getUpdateListTablesList();
          if (updateTables.length) {
            const now = new Date();
            await Promise.all(
              updateTables.map(async (table) => {
                const data = await get(`/api/${table}`);
                await storageMethod.db.transaction(
                  "rw",
                  [table, tablesMetadataName],
                  async () => {
                    await storageMethod.db.table(table).clear();
                    await storageMethod.db.table(table).bulkAdd(data);
                    await storageMethod.db
                      .table(tablesMetadataName)
                      .update(table, { lastUpdate: now });
                  },
                );
              }),
            );
          }
        }
        setListTablesReady(true);
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isOffline]);

  // Step 2: Cache list tables into React Query
  const listTablesQueries = listTablesNamesList.map((tableName) => {
    const queryFn = () => find(tableName);

    return {
      queryKey: [listDataKey, tableName],
      queryFn,
      enabled: listTablesReady, // Only fetch if list tables are ready
      staleTime: HOUR_MS,
    };
  });

  const queries = useQueries({ queries: listTablesQueries });

  const cacheLoading = queries.some((query) => query.isLoading);
  const cacheError = queries.some((query) => query.isError);
  const cacheLoadError = queries.find((query) => query.isError)?.error || null;
  const data = queries.reduce((acc, query, index) => {
    acc[listTablesNamesList[index]] = query.data || null;
    return acc;
  }, {});

  // Final state management
  useEffect(() => {
    if (!isLoading && !isError && !cacheLoading && !cacheError) {
      setIsReady(true);
    }
  }, [isLoading, isError, cacheLoading, cacheError]);

  return {
    data,
    isReady,
    isLoading: isLoading || cacheLoading,
    isError: isError || cacheError,
    error: error || cacheLoadError,
  };
};
