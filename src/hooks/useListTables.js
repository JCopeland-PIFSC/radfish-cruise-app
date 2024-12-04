import { useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";
import { listDataKey } from "./useInitializeAndCacheListTables";

const HOUR_MS = 1000 * 60 * 60;

const portsTableName = "ports";
const cruiseStatusesTableName = "cruiseStatuses";
const sampleTypesTableName = "sampleTypes";
const precipitationTableName = "precipitation";
const speciesTableName = "species";

export const usePortsList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [listDataKey, portsTableName],
    queryFn: () => dbManager.getTableRecords(portsTableName, "name"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useCruiseStatusesList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [listDataKey, cruiseStatusesTableName],
    queryFn: () => dbManager.getTableRecords(cruiseStatusesTableName),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useSampleTypesList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [listDataKey, sampleTypesTableName],
    queryFn: () => dbManager.getTableRecords(sampleTypesTableName),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const usePrecipitationList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [listDataKey, precipitationTableName],
    queryFn: () => dbManager.getTableRecords(precipitationTableName),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useSpeciesList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [listDataKey, speciesTableName],
    queryFn: () => dbManager.getTableRecords(speciesTableName, "name"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};
