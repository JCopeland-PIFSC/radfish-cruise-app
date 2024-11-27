import { useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";

const HOUR_MS = 1000 * 60 * 60;

export const usePortsList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: ["coreTableData", "ports"],
    queryFn: () => dbManager.getTableRecords("ports", "name"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useCruiseStatusesList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: ["coreTableData", "cruiseStatuses"],
    queryFn: () => dbManager.getTableRecords("cruiseStatuses"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useSampleTypesList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: ["coreTableData", "sampleTypes"],
    queryFn: () => dbManager.getTableRecords("sampleTypes"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const usePrecipitationList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: ["coreTableData", "precipitation"],
    queryFn: () => dbManager.getTableRecords("precipitation"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useSpeciesList = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: ["coreTableData", "species"],
    queryFn: () => dbManager.getTableRecords("species", "name"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};
