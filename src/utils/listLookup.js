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
