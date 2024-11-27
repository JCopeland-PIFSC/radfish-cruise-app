import { useState, useEffect } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";
import { get } from "../utils/requestMethods";

const HOUR_MS = 1000 * 60 * 60;

export const useInitializeAndCacheCoreTables = (isOffline) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [coreTablesReady, setCoreTablesReady] = useState(false);

  const sortByNameList = ["ports", "species", "sampleType"];

  const dbManager = DatabaseManager.getInstance();
  const coreTableNames = dbManager.coreTablesNamesList;

  // Step 1: Initialize core tables
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const emptyTables = await dbManager.getEmptyCoreTablesList();
        if (isOffline && emptyTables.length) {
          // Offline and tables are not initialized
          throw new Error("Offline and core tables are uninitialized.");
        } else if (!isOffline) {
          const updateTables = await dbManager.getUpdateCoreTablesList();
          if (updateTables.length) {
            const now = new Date();
            await Promise.all(
              updateTables.map(async (table) => {
                const data = await get(`/api/${table}`);
                await dbManager.db.transaction(
                  "rw",
                  [table, dbManager.tablesMetadata],
                  async () => {
                    await dbManager.db.table(table).clear();
                    await dbManager.db.table(table).bulkAdd(data);
                    await dbManager.db
                      .table(dbManager.tablesMetadata)
                      .update(table, { lastUpdate: now });
                  },
                );
              }),
            );
          }
        }
        setCoreTablesReady(true);
      } catch (err) {
        setIsError(true);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [isOffline]);

  // Step 2: Cache core tables into React Query
  const coreTableQueries = coreTableNames.map((tableName) => {
    const queryFn = () =>
      dbManager.getTableRecords(
        tableName,
        sortByNameList.includes(tableName) ? "name" : null,
      );

    return {
      queryKey: ["coreTableData", tableName],
      queryFn,
      enabled: coreTablesReady, // Only fetch if core tables are ready
      staleTime: HOUR_MS,
    };
  });

  const queries = useQueries({ queries: coreTableQueries });

  const cacheLoading = queries.some((query) => query.isLoading);
  const cacheError = queries.some((query) => query.isError);
  const cacheLoadError = queries.find((query) => query.isError)?.error || null;
  const data = queries.reduce((acc, query, index) => {
    acc[coreTableNames[index]] = query.data || null;
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
