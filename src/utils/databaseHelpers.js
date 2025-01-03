import { tablesMetadataTableName, tablesMetadataSeed } from "../db/config.js";
import { updateNeeded } from "./dateTimeHelpers.js";

export const tablesMetadataName = tablesMetadataTableName;

export const listTablesNamesList = tablesMetadataSeed.map(
  (table) => table.tableName,
);

/**
 * Retrieves the records for all list tables defined in `listTablesNamesList`.
 *
 * This method fetches records for each table listed in `listTablesNamesList` from the
 * `tablesMetadata` table. It returns an array of records, with each entry corresponding
 * to a table in the list.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of records from the list tables.
 * @throws {Error} Throws an error if the records cannot be fetched from the `tablesMetadata` table.
 */
async function getListTablesMetadataRecords(db) {
  try {
    return await Promise.all(
      listTablesNamesList.map(async (tableName) => {
        return await db.table(tablesMetadataName).get(tableName);
      }),
    );
  } catch (error) {
    throw new Error(
      `Failed to fetch list table records for ${tableName}: ${error.message}`,
    );
  }
}

/**
 * Retrieves a list of list table names that have not been initialized.
 *
 * This method checks the records of all list tables. It returns a list of table names that
 * have not been initialized, which is determined by whether the `lastUpdate` field is null.
 *
 * @param {Object} db - Dexie database instance.
 * @returns {Promise<string[]>} A promise that resolves to a list of table names for list tables that have not been initialized.
 * @throws {Error} Throws an error if there is an issue fetching the list table records.
 */
export async function getEmptyListTablesList(db) {
  try {
    const listTablesMetadataRecords = await getListTablesMetadataRecords(db);
    return listTablesMetadataRecords
      .map((tableRecord, index) => {
        if (!tableRecord) return listTablesNamesList[index];
        const { lastUpdate } = tableRecord;
        return lastUpdate === null ? listTablesNamesList[index] : null;
      })
      .filter((tableName) => tableName !== null);
  } catch (error) {
    throw new Error(`Failed to get empty list tables list: ${error.message}`);
  }
}

/**
 * Retrieves a list of list table names that need to be updated.
 *
 * This method checks the records of all list tables. It returns a list of table names for
 * list tables that either have not been initialized (i.e., `lastUpdate` is null) or need to be
 * refreshed based on the `lastUpdate` and `updateThreshold` fields. The `updateNeeded` function
 * is used to determine if a table is outdated.
 *
 * @param {Object} db - Dexie database instance.
 * @returns {Promise<string[]>} A promise that resolves to a list of table names for list tables that need to be updated.
 * @throws {Error} Throws an error if there is an issue fetching the list table records.
 */
export async function getUpdateListTablesList(db) {
  try {
    const listTablesMetadataRecords = await getListTablesMetadataRecords(db);
    return listTablesMetadataRecords
      .map((tableRecord, index) => {
        if (!tableRecord) return listTablesNamesList[index];
        const { lastUpdate, updateThreshold } = tableRecord;
        const willUpdate = updateNeeded(lastUpdate, updateThreshold);
        return willUpdate ? listTablesNamesList[index] : null;
      })
      .filter((tableName) => tableName !== null);
  } catch (error) {
    throw new Error(`Failed to get update list tables list: ${error.message}`);
  }
}

/**
 * Initializes the metadata table with the provided seed records if it doesn't already exist or has no records.
 *
 * This method checks whether the specified metadata table already has records. If not, it will clear any
 * existing data in the table and bulk add the provided seed records. If the table is successfully seeded,
 * a success message is logged. If no records are added, a different message is logged.
 *
 * @param {Object} db - Dexie database instance.
 * @param {Array} seedRecords - The records to insert into the table if it is empty. Defaults to `listTablesMetadataSeed`.
 * @param {string} metadataName - The name of the metadata table. Defaults to `tablesMetadata`.
 * @throws {Error} Will throw an error if the bulkAdd operation fails.
 * @returns {Promise<void>} A promise that resolves when the table has been initialized, or throws an error if it fails.
 *
 * @example
 * await initMetadataTable(); // Uses default seed records and metadata table name
 * await initMetadataTable(customSeed, "customMetadata"); // Uses custom values
 */

export async function initMetadataTable(
  db,
  seedRecords,
  metadataName = "tablesMetadata",
) {
  try {
    // Check if the metadata table has any records
    const hasListTables = await tableExistsHasRecords(db, metadataName);

    // If the table doesn't have records, proceed with initialization
    if (!hasListTables) {
      await clearTableData(db, metadataName);

      // Bulk add the seed records
      const bulkAdd = await db
        .table(metadataName)
        .bulkAdd(seedRecords, { allKeys: true });

      // Log results based on whether records were added
      if (bulkAdd.length > 0) {
        console.log(`Table "${metadataName}" initialized.`);
      } else {
        console.log(`No records added during bulkAdd to "${metadataName}.`);
      }
    } else {
      console.log(`Table "${metadataName}" already has records.`);
    }
  } catch (error) {
    // Log the error and rethrow it
    console.error("Error initializing metadata table:", error);
    throw new Error(`Failed to initialize metadata table: ${error.message}`);
  }
}

/**
 * Checks if a table exists in the database and has at least one record.
 *
 * This method attempts to count the records in the specified table. If the table exists
 * and contains records, it returns `true`. If the table doesn't exist, it returns `false`.
 * Any other errors, such as database connectivity issues, are re-thrown.
 *
 * @param {Object} db - Dexie database instance.
 * @param {string} tableName - The name of the table to check for existence and records.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the table exists and has records, `false` otherwise.
 * @throws {Error} Throws an error if there is a problem with the database query other than a "NoSuchTable" error.
 */

async function tableExistsHasRecords(db, tableName) {
  try {
    const count = await db.table(tableName).count();
    return count > 0;
  } catch (error) {
    if (error.name === "NoSuchTable") {
      return false;
    }
    // Re-throw error if it's not related to a non-existing table
    throw new Error(
      `Failed to check records in table "${tableName}": ${error.message}`,
    );
  }
}

/**
 * Clear contents of table.
 *
 * @param {Object} db - Dexie database instance.
 * @param {string} tableName - The name of the table to check for existence and records.
 * @returns {Promise} A promise that resolves or rejects.
 * @throws {Error} Throws an error if there is a problem with the database query.
 *
 */

async function clearTableData(db, tableName) {
  try {
    await db.table(tableName).clear();
    console.log(`Table "${tableName}" cleared.`);
  } catch (error) {
    throw new Error(`Failed to clear table "${tableName}": ${error.message}`);
  }
}
