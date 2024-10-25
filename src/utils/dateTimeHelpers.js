import { parseISO, differenceInMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

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
