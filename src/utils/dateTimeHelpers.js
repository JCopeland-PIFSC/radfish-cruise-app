import { parseISO, differenceInMinutes, parse } from "date-fns";
import { tz } from "@date-fns/tz";
import tz_lookup from "@photostructure/tz-lookup";

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

  const regex =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(:(\d{2}(?:\.\d{3})?))?([+-]\d{2}:\d{2})$/;
  const match = timestamp.match(regex);

  if (!match) {
    return "";
  }

  const date = match[1]; // "YYYY-MM-DD"
  const time = match[2]; // "HH:mm"
  const seconds = match[4] || null; // Only "SS" or "SS.SSS" without the colon
  const offset = match[5]; // "+HH:MM" or "-HH:MM"

  return `${date} ${time} ${offset}`;
}
