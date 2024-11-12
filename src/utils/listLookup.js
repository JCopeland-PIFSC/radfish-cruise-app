export function listValueLookup(list, idKey, keyName = "name") {
  if (!list.length || !idKey) return "";

  const rec = list.find((elem) => elem.id.toString() === idKey.toString());
  return rec ? rec[keyName] : "";
}

export const CruiseStatus = {
  STARTED: "1",
  ENDED: "2",
  SUBMITTED: "3",
  REJECTED: "4",
  ACCEPTED: "5",
};

export const EventType = {
  BEGIN_SET: "beginSet",
  END_SET: "endSet",
  BEGIN_HAUL: "beginHaul",
  END_HAUL: "endHaul",
};
