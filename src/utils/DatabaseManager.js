import { IndexedDBMethod } from "@nmfs-radfish/radfish";
import { updateNeeded } from "./dateTimeHelpers";

class DatabaseManager {
  static #instance = null;

  /**
   * Constructor to initialize the DatabaseManager instance.
   *
   * This constructor sets up the database connection, validates the required
   * configuration properties, and initializes the necessary metadata and core tables.
   *
   * @param {Object} config - Configuration object for initializing the database.
   * @throws {Error} If required properties are missing from the config or if the singleton instance is already initialized.
   */
  constructor(config) {
    if (DatabaseManager.#instance) {
      throw new Error(
        "Use DatabaseManager.getInstance() to access the database singleton.",
      );
    }

    // Validate the configuration object
    this.#validateConfig(config);

    const { name, version, stores } = config.offlineStorageConfig;

    // Initialize the IndexedDB method
    const storageMethod = new IndexedDBMethod(name, version, stores);
    this.db = storageMethod.db;
    this.offlineStorageConfig = config.offlineStorageConfig;
    this.tablesMetadata = config.tablesMetadata;
    this.coreMetadataSeed = config.coreMetadataSeed;
    this.coreTablesNamesList = config.coreMetadataSeed.map(
      (table) => table.tableName,
    );

    // Assign the singleton instance
    DatabaseManager.#instance = this;
  }

  /**
   * Validates the provided configuration object to ensure all required properties are present and correctly typed.
   *
   * @param {Object} config - The configuration object to validate.
   * @throws {Error} If any required property is missing or incorrectly typed.
   */
  #validateConfig(config) {
    // Check if the config is an object
    if (typeof config !== "object" || config === null) {
      throw new Error("Configuration must be a valid object.");
    }

    // Verify required properties exist in config
    const requiredProperties = [
      "offlineStorageConfig",
      "tablesMetadata",
      "coreMetadataSeed",
    ];

    const missingProperties = requiredProperties.filter(
      (property) => !(property in config),
    );

    if (missingProperties.length > 0) {
      throw new Error(
        `Missing required config property: ${missingProperties.join(", ")}`,
      );
    }

    // Further validate the offlineStorageConfig structure
    const { offlineStorageConfig } = config;
    if (
      typeof offlineStorageConfig !== "object" ||
      offlineStorageConfig === null ||
      !offlineStorageConfig.name ||
      !offlineStorageConfig.version ||
      typeof offlineStorageConfig.stores !== "object"
    ) {
      throw new Error(
        'offlineStorageConfig must be an object with "name", "version", and "stores" properties.',
      );
    }

    // Validate coreMetadataSeed structure
    if (
      !Array.isArray(config.coreMetadataSeed) ||
      config.coreMetadataSeed.length === 0
    ) {
      throw new Error("coreMetadataSeed must be a non-empty array.");
    }
  }

  /**
   * Retrieves the singleton instance of the DatabaseManager.
   *
   * If the singleton instance does not exist, it is created using the provided configuration.
   * Once the instance is created, it cannot be reinitialized with a new configuration.
   *
   * @param {Object} config - Configuration object for initializing the DatabaseManager, required only if instance does not exist.
   * @throws {Error} If the instance already exists or if the config is missing when the instance is not initialized.
   * @returns {DatabaseManager} The singleton instance of DatabaseManager.
   */
  static getInstance(config) {
    // If the singleton instance already exists, return it
    if (DatabaseManager.#instance) {
      return DatabaseManager.#instance;
    }

    // If the instance does not exist, initialize it with the provided config
    if (!config) {
      throw new Error(
        "DatabaseManager must be initialized with a valid configuration.",
      );
    }

    new DatabaseManager(config); // This will initialize the instance
    return DatabaseManager.#instance;
  }

  /**
   * Initializes the metadata table with the provided seed records if it doesn't already exist or has no records.
   *
   * This method checks whether the specified metadata table already has records. If not, it will clear any
   * existing data in the table and bulk add the provided seed records. If the table is successfully seeded,
   * a success message is logged. If no records are added, a different message is logged.
   *
   * @param {Array} seedRecords - The records to insert into the table if it is empty. Defaults to `coreMetadataSeed`.
   * @param {string} metadataName - The name of the metadata table. Defaults to `tablesMetadata`.
   * @throws {Error} Will throw an error if the bulkAdd operation fails.
   * @returns {Promise<void>} A promise that resolves when the table has been initialized, or throws an error if it fails.
   *
   * @example
   * await initMetadataTable(); // Uses default seed records and metadata table name
   * await initMetadataTable(customSeed, "customMetadata"); // Uses custom values
   */
  async initMetadataTable(
    seedRecords = this.coreMetadataSeed,
    metadataName = this.tablesMetadata,
  ) {
    try {
      // Check if the metadata table has any records
      const hasCoreTables = await this.tableExistsHasRecords(metadataName);

      // If the table doesn't have records, proceed with initialization
      if (!hasCoreTables) {
        await this.clearTableData(metadataName);

        // Bulk add the seed records
        const bulkAdd = await this.db
          .table(metadataName)
          .bulkAdd(seedRecords, { allKeys: true });

        // Log results based on whether records were added
        if (bulkAdd.length > 0) {
          console.log("Core tables seeded successfully.");
        } else {
          console.log("No records added during bulkAdd.");
        }
      } else {
        console.log("Metadata table already has records.");
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
   * @param {string} tableName - The name of the table to check for existence and records.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the table exists and has records, `false` otherwise.
   * @throws {Error} Throws an error if there is a problem with the database query other than a "NoSuchTable" error.
   */
  async tableExistsHasRecords(tableName) {
    try {
      const count = await this.db.table(tableName).count();
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
   * Retrieves the records for all core tables defined in `coreTablesNamesList`.
   *
   * This method fetches records for each table listed in `coreTablesNamesList` from the
   * `tablesMetadata` table. It returns an array of records, with each entry corresponding
   * to a table in the list.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of records from the core tables.
   * @throws {Error} Throws an error if the records cannot be fetched from the `tablesMetadata` table.
   */
  async getCoreTablesRecords() {
    try {
      return await Promise.all(
        this.coreTablesNamesList.map(async (tableName) => {
          return await this.db.table(this.tablesMetadata).get(tableName);
        }),
      );
    } catch (error) {
      throw new Error(
        `Failed to fetch core table records for ${tableName}: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves a list of core table names that have not been initialized.
   *
   * This method checks the records of all core tables. It returns a list of table names that
   * have not been initialized, which is determined by whether the `lastUpdate` field is null.
   *
   * @returns {Promise<string[]>} A promise that resolves to a list of table names for core tables that have not been initialized.
   * @throws {Error} Throws an error if there is an issue fetching the core table records.
   */
  async getEmptyCoreTablesList() {
    try {
      const coreTableRecords = await this.getCoreTablesRecords();
      return coreTableRecords
        .map((tableRecord, index) => {
          if (!tableRecord) return this.coreTablesNamesList[index];
          const { lastUpdate } = tableRecord;
          return lastUpdate === null ? this.coreTablesNamesList[index] : null;
        })
        .filter((tableName) => tableName !== null);
    } catch (error) {
      throw new Error(`Failed to get empty core tables list: ${error.message}`);
    }
  }

  /**
   * Retrieves a list of core table names that need to be updated.
   *
   * This method checks the records of all core tables. It returns a list of table names for
   * core tables that either have not been initialized (i.e., `lastUpdate` is null) or need to be
   * refreshed based on the `lastUpdate` and `updateThreshold` fields. The `updateNeeded` function
   * is used to determine if a table is outdated.
   *
   * @returns {Promise<string[]>} A promise that resolves to a list of table names for core tables that need to be updated.
   * @throws {Error} Throws an error if there is an issue fetching the core table records.
   */
  async getUpdateCoreTablesList() {
    try {
      const coreTableRecords = await this.getCoreTablesRecords();
      return coreTableRecords
        .map((tableRecord, index) => {
          if (!tableRecord) return this.coreTablesNamesList[index];
          const { lastUpdate, updateThreshold } = tableRecord;
          const willUpdate = updateNeeded(lastUpdate, updateThreshold);
          return willUpdate ? this.coreTablesNamesList[index] : null;
        })
        .filter((tableName) => tableName !== null);
    } catch (error) {
      throw new Error(
        `Failed to get update core tables list: ${error.message}`,
      );
    }
  }

  /**
   * Retrieves all records from a specified table, optionally filtering, sorting, and returning the results.
   *
   * This method interacts with the IndexedDB through the Dexie.js library to fetch data from a table.
   * If a `where` parameter is provided, the records will be filtered according to the specified condition.
   * If a `sort` parameter is provided, the data will be sorted based on the given field. If the field starts
   * with a hyphen ('-'), the results are returned in descending order; otherwise, they are returned in ascending order.
   * If no `where` or `sort` parameter is provided, all records are returned unsorted.
   *
   * @param {string} name - The name of the table to retrieve data from. Should be a valid table name.
   * @param {Object} [where] - The filtering condition. A key-value pair where the key is the field to filter on and the value is the condition to match.
   * @param {string} [sort] - The field by which to sort the results. If it starts with a '-', the sorting will be descending.
   * @returns {Promise<Array>} A promise that resolves to an array of records from the table.
   * @throws {Error} Throws an error if the table name is invalid, there is an issue with fetching data, or if the filtering condition is invalid.
   */
  async getTableRecords(name, where, sort) {
    if (!this.isValidTableName(name)) throw new Error("Invalid table name");

    try {
      let query = this.db.table(name);

      query = this.applyWhereCondition(query, where);
      query = this.applySorting(query, sort);

      return await query.toArray();
    } catch (error) {
      throw new Error(
        `Failed to fetch data from table "${name}": ${error.message}`,
      );
    }
  }

  isValidTableName(name) {
    return typeof name === "string" && name.trim();
  }

  applyWhereCondition(query, where) {
    if (where && typeof where === "object") {
      for (const [key, value] of Object.entries(where)) {
        query = query.where(key).equals(value);
      }
    }
    return query;
  }

  applySorting(query, sort) {
    if (sort && typeof sort === "string") {
      sort = sort.trim();
      if (sort.startsWith("-")) {
        return query.orderBy(sort.substring(1)).reverse();
      } else {
        return query.orderBy(sort);
      }
    }
    return query;
  }

  async clearTableData(tableName) {
    try {
      await this.db.table(tableName).clear();
      console.log(`Table "${tableName}" cleared successfully.`);
    } catch (error) {
      throw new Error(`Failed to clear table "${tableName}": ${error.message}`);
    }
  }
}

export default DatabaseManager;
