export function listValueLookup(list, idKey, keyName = "name") {
  if (!list.length || !idKey) return "";

  const rec = list.find((elem) => elem.id.toString() === idKey.toString());
  return rec ? rec[keyName] : "";
}
