import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { get, genListQueryParams } from "../utils/requestMethods";
import { tableNames } from "../db/store";
import { getUserCruisesList } from "../utils/databaseHelpers";
import { CruiseStatus } from "../utils/listLookup";

export const useCruiseAndStations = () => {
  const { findOne, create, update, storageMethod } = useOfflineStorage();

  /**
   * Fetches user cruises from the backend and stores them in the local database
   * @param {string} userId
   * @returns {<void>}
   * @throws {Error} Throws an error if there is a problem fetching or storing user cruises
   */
  const fetchAndStoreRemoteUserCruises = async (userId) => {
    try {
      const fetchedUserCruises = await get(
        `/api/${tableNames.userCruises}`,
        `id=${userId}`,
      );
      const userCruises = fetchedUserCruises[0];

      await findOne(tableNames.userCruises, {
        where: { id: userId },
      })
        .then((localRecord) => {
          if (!localRecord) {
            create(tableNames.userCruises, userCruises);
            return null;
          }
        })
        .catch((error) => {
          throw new Error(`Error storing userCruises: ${error}`);
        });
    } catch (error) {
      throw new Error(`Error fetching and storing user cruises: ${error}`);
    }
  };

  const fetchAndStoreList = async (tableName, key, setList) => {
    try {
      const queryParams = genListQueryParams(key, setList);
      const fetchedData = await get(`/api/${tableName}`, queryParams);
      const table = storageMethod.db.table(tableName);

      await storageMethod.db.transaction("rw", table, async () => {
        for (const fetchedRecord of fetchedData) {
          const localRecord = await table.get(fetchedRecord.id);
          if (!localRecord) await table.put(fetchedRecord);
        }
      });
    } catch (error) {
      throw new Error(`Error fetching and storing ${tableName}: ${error}`);
    }
  };

  const initializeDataFromBackend = async (userId) => {
    try {
      await fetchAndStoreRemoteUserCruises(userId);
      const userCruisesList = await getUserCruisesList(userId);
      await fetchAndStoreList(tableNames.cruises, "id", userCruisesList);
      await fetchAndStoreList(tableNames.stations, "cruiseId", userCruisesList);
    } catch (error) {
      console.error("Error initializing data from backend: ", error);
      throw new Error(`Error initializing data from backend: ${error}`);
    }
  };
  /**
   * Fetches local list of user's cruises from the database
   * @param {string} userId
   * @returns {Promise<Array>} A promise that resolves to an array of user's cruises
   * @throws {Error} Throws an error if there is a problem fetching local user cruises
   */
  const fetchLocalCruises = async (userId) => {
    try {
      const userCruisesList = await getUserCruisesList(userId);
      return await storageMethod.db
        .table(tableNames.cruises)
        .bulkGet(userCruisesList);
    } catch (error) {
      throw new Error(`Error fetching local cruises: ${error}`);
    }
  };

  const fetchLocalStations = async (userId) => {
    try {
      const userCruisesList = await getUserCruisesList(userId);
      return await Promise.all(
        userCruisesList.map(async (cruiseId) => {
          return await storageMethod.db
            .table(tableNames.stations)
            .where({ cruiseId })
            .toArray();
        }),
      ).then((stations) => stations.flat());
    } catch (error) {
      throw new Error(`Error fetching local stations: ${error}`);
    }
  };

  const addCruise = async (userId, cruise) => {
    try {
      const newCruiseId = await create(tableNames.cruises, cruise);
      const userCruises = await findOne(tableNames.userCruises, {
        where: { id: userId },
      });
      if (!userCruises) {
        await create(tableNames.userCruises, {
          id: userId,
          cruises: [newCruiseId],
        });
      } else {
        // check if cruise already exists in userCruises
        if (userCruises.cruises.includes(newCruiseId)) return;
        await update(tableNames.userCruises, [
          {
            id: userId,
            cruises: [...userCruises.cruises, newCruiseId],
            uuid: userCruises.uuid || crypto.randomUUID(),
          },
        ]);
      }
    } catch (error) {
      throw new Error(`Error adding cruise: ${error}`);
    }
  };

  const updateCruise = async (cruiseId, updates) => {
    let startDate = new Date(updates.startDate);
    let endDate = new Date(updates.endDate);
    if (updates.cruiseStatusId === CruiseStatus.REJECTED) {
      if (startDate <= endDate) {
        updates.cruiseStatusId = CruiseStatus.ENDED;
      } else if (!isNaN(startDate)) {
        updates.cruiseStatusId = CruiseStatus.STARTED;
      }
    }
    try {
      await update(tableNames.cruises, [
        { id: cruiseId, ...updates, uuid: updates.uuid || crypto.randomUUID() },
      ]);
    } catch (error) {
      throw new Error(`Error updating cruise: ${error}`);
    }
  };

  const addStation = async (station) => {
    try {
      await create(tableNames.stations, station);
    } catch (error) {
      throw new Error(`Error adding station: ${error}`);
    }
  };

  const updateStation = async ({ cruiseId, stationId, updates }) => {
    try {
      await update(tableNames.stations, [
        {
          id: stationId,
          cruiseId,
          ...updates,
          uuid: updates.uuid || crypto.randomUUID(),
        },
      ]);
    } catch (error) {
      throw new Error(`Error updating station: ${error}`);
    }
  };

  return {
    initializeDataFromBackend,
    fetchLocalCruises,
    fetchLocalStations,
    addCruise,
    updateCruise,
    addStation,
    updateStation,
  };
};
