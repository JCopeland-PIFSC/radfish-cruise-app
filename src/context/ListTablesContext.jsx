import React, { createContext, useContext, useState, useEffect } from 'react';
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { useOfflineStatus } from "@nmfs-radfish/react-radfish";
import { get } from "../utils/requestMethods";
import {
  tablesMetadataName,
  listTablesNamesList,
  getEmptyListTablesList,
  getUpdateListTablesList,
} from "../utils/databaseHelpers";

const ListTablesContext = createContext();

export const ListTablesProvider = ({ children }) => {
  const { isOffline } = useOfflineStatus();
  const { find, storageMethod } = useOfflineStorage();
  const [listTablesStored, setListTablesStored] = useState(false);
  const [state, setState] = useState({
    listsReady: false,
    loading: true,
    error: null,
    lists: {},
  });

  // Step 1: Load list tables into Dexie from API
  useEffect(() => {
    const fetchAndStoreToLocalDb = async () => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      // Check if list tables are initialized
      try {
        const emptyTables = await getEmptyListTablesList();
        if (isOffline && emptyTables?.length) {
          throw new Error("Offline and list tables are NOT initialized.");
        } else if (!isOffline) {
          const updateTables = await getUpdateListTablesList();
          if (updateTables.length) {
            const now = new Date();
            const lists = {};
            await Promise.all(
              updateTables.map(async (table) => {
                const data = await get(`/api/${table}`);
                lists[table] = data;
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
              })
            );
          }
        }
        setListTablesStored(true);
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          error: error.message,
          loading: false,
        }));
      }
    };

    fetchAndStoreToLocalDb();
  }, [isOffline]);

  // Step 2: Load list tables into context state from Dexie
  useEffect(() => {
    const loadListTablesStateFromLocalDb = async () => {
      if (listTablesStored) {
        const lists = {};
        try {
          await Promise.all(
            listTablesNamesList.map(async (tableName) => {
              const data = await find(tableName);
              lists[tableName] = data;
            })
          );
          setState((prevState) => ({
            ...prevState,
            listsReady: true,
            lists,
          }));
        } catch (error) {
          setState((prevState) => ({
            ...prevState,
            error: error.message,
          }));
        } finally {
          setState((prevState) => ({ ...prevState, loading: false }));
        }
      }
    };

    loadListTablesStateFromLocalDb();
  }, [listTablesStored]);

  return (
    <ListTablesContext.Provider value={state}>
      {children}
    </ListTablesContext.Provider>
  );
};

export const useListTablesContext = () => useContext(ListTablesContext);