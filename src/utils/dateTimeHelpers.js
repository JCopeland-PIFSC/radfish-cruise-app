import { parseISO, differenceInMinutes, parse, format, set } from "date-fns";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

export function utcToLocalDateTime(utcDateString) {
  if (!utcDateString) return "";

  const date = parseISO(utcDateString);

  return formatInTimeZone(
    date,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    "MM/dd/yy h:mm a",
  );
}

export function getSoakTime(begTime, endTime) {
  if (!begTime || !endTime) return "";

  const startTimestamp = parseISO(begTime);
  const endTimestamp = parseISO(endTime);
  const totalMinutes = differenceInMinutes(endTimestamp, startTimestamp);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

export function combineDateTime(date, time) {
  // Convert strings to Date objects in system timezone
  const parsedDate = parse(date, "yyyy-MM-dd", new Date()); // Adjust date format as needed
  const parsedTime = parse(time, "HH:mm", new Date()); // Adjust time format as needed

  // Combine date and time into a single Date object
  const combinedDateTime = set(parsedDate, {
    hours: parsedTime.getHours(),
    minutes: parsedTime.getMinutes(),
    seconds: 0,
  });
  // Convert the combined Date to UTC
  const utcDate = fromZonedTime(
    combinedDateTime,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  return format(utcDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}
