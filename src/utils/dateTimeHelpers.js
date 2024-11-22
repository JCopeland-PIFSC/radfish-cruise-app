import { parseISO, differenceInMinutes, parse } from "date-fns";
import { tz } from "@date-fns/tz";
import tz_lookup from "@photostructure/tz-lookup";

const TS_REGEX =
  /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:(\d{2}(?:\.\d{3})?))?([+-]\d{2}:\d{2})$/;

/**
 *
 * @param {string} begTime - DateTime string in format yyyy-MM-dd'T'HH:mmXXX, e.g., "2024-10-02T09:00-07:00"
 * @param {string} endTime - DateTime string in format yyyy-MM-dd'T'HH:mmXXX, value should be later than begTime.
 * @returns {string} The time difference between begTime and endTime as string. e.g., "1h 47m"
 */
export function getSoakTime(begTime, endTime) {
  if (!begTime || !endTime) return "";

  const startTimestamp = parseISO(begTime);
  const endTimestamp = parseISO(endTime);
  const totalMinutes = differenceInMinutes(endTimestamp, startTimestamp);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/**
 * Using location coordinate the IANA timezone will be looked up.
 * @param {string} latitude - The lat string is "±dd.ddd" format.
 * @param {string} longitude - The long string in "±dd.ddd"
 * @returns {string} The IANA timezone string, e.g., "Pacific/Honolulu"
 */
export function getLocationTz(latitude, longitude) {
  if ((latitude, longitude)) {
    return tz_lookup(latitude, longitude);
  } else {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

/**
 * Combines date, time, and timezone to produce a formatted date string.
 * @param {string} date - The date string in "yyyy-MM-dd" format.
 * @param {string} time - The time string in "HH:mm" format.
 * @param {string} timezone - The IANA timezone string, e.g., "America/Los_Angeles".
 * @returns {string} The formatted date string in "yyyy-MM-dd'T'HH:mmXXX" format.
 */
export function generateTzDateTime(date, time, timezone) {
  const format = "yyyy-MM-dd HH:mm";
  const locTz = tz(timezone);
  return parse(`${date} ${time}`, format, new Date(), {
    in: locTz,
  }).toISOString();
}

export function displayTzDateTime(timestamp) {
  if (!timestamp) return "";

  const match = timestamp.match(TS_REGEX);

  if (!match) return "";

  const date = match[1]; // "YYYY-MM-DD"
  const time = match[2]; // "HH:mm"
  const seconds = match[4] || null; // Only "SS" or "SS.SSS" without the colon
  const offset = match[5]; // "+HH:MM" or "-HH:MM"

  return `${date} ${time} ${offset}`;
}

/**
 * Extracts and returns the date, time, and timezone offset parts from a timestamp string.
 *
 * This function uses a regular expression to match and extract the date, time, and timezone offset from
 * a timestamp string. The expected format for the timestamp is ISO 8601 with a timezone offset, which should
 * match the following pattern:
 *
 * - Date: `YYYY-MM-DD`
 * - Time: `HH:mm` (optional seconds `:ss` and milliseconds `:sss`)
 * - Timezone offset: `+hh:mm` or `-hh:mm`
 *
 * If the timestamp does not match the expected format, an empty object with empty strings for `date`, `time`,
 * and `offset` is returned. If the `timestamp` is falsy or does not match the regular expression, the function
 * will also return the empty object.
 *
 * @param {string} timestamp - A timestamp string, expected to match the format `YYYY-MM-DDTHH:mm(:ss(:sss))?[+-]hh:mm`.
 *   If the timestamp is falsy or does not match the expected format, an empty object is returned.
 * @returns {Object} An object with the following properties:
 *   - `date` {string} - The extracted date part from the timestamp, or an empty string if not found.
 *   - `time` {string} - The extracted time part from the timestamp, or an empty string if not found.
 *   - `offset` {string} - The extracted timezone offset part from the timestamp, or an empty string if not found.
 *
 * @example
 * const timestamp = "2024-11-22T14:23:00+00:00";
 * const result = getTzDateTimeParts(timestamp);
 * console.log(result);
 * // Output: { date: "2024-11-22", time: "14:23:00", offset: "+00:00" }
 *
 * @see {RegExp} TS_REGEX - The regular expression used to match the timestamp string.
 */
export function getTzDateTimeParts(timestamp) {
  const res = {
    date: "",
    time: "",
    offset: "",
  };

  if (!timestamp) return res;

  const match = timestamp.match(TS_REGEX);

  if (!match) return res;

  res.date = match[1];
  res.time = match[2];
  res.offset = match[5];

  return res;
}

/**
 * Determines whether a table needs to be updated based on its `lastUpdate` and `updateThreshold` values.
 *
 * This helper function compares the `lastUpdate` timestamp (in milliseconds) with the `updateThreshold`
 * (also in milliseconds). If the difference between `lastUpdate` and the current time exceeds the threshold,
 * the table is considered outdated and needs to be updated. The `updateThreshold` must be a positive integer.
 *
 * @param {number|null} lastUpdate - The timestamp of the last update, in milliseconds. If `null`, the table is considered uninitialized.
 * @param {number} updateThreshold - The threshold in milliseconds. If the difference between the current time and `lastUpdate` exceeds this value, the table needs to be updated.
 * @returns {boolean} Returns `true` if the table is outdated and needs an update, `false` otherwise.
 * @throws {Error} Throws an error if the `updateThreshold` is not a positive integer.
 */
export function updateNeeded(lastUpdate, updateThreshold) {
  if (lastUpdate === null) return true; // Table is uninitialized

  // Validate the updateThreshold
  if (
    typeof updateThreshold !== "number" ||
    updateThreshold <= 0 ||
    !Number.isInteger(updateThreshold)
  ) {
    throw new Error("The updateThreshold must be a positive integer.");
  }

  const currentTime = Date.now();
  return currentTime - lastUpdate > updateThreshold; // Compare current time with last update
}
