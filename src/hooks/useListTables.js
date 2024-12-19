import { useQuery } from "@tanstack/react-query";
import { listDataKey } from "./useInitializeAndCacheListTables";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

const HOUR_MS = 1000 * 60 * 60;

const portsTableName = "ports";
const cruiseStatusesTableName = "cruiseStatuses";
const sampleTypesTableName = "sampleTypes";
const precipitationTableName = "precipitation";
const speciesTableName = "species";

export const useList = (
  tableName,
  options = { staleTime: HOUR_MS * 1, cacheTime: HOUR_MS * 24 },
) => {
  return () => {
    const { find } = useOfflineStorage();

    return useQuery({
      queryKey: [listDataKey, tableName],
      queryFn: () => find(tableName),
      staleTime: options.staleTime,
      cacheTime: options.cacheTime,
    });
  };
};

export const usePortsList = useList(portsTableName);

export const useCruiseStatusesList = useList(cruiseStatusesTableName);

export const useSampleTypesList = useList(sampleTypesTableName);

export const usePrecipitationList = useList(precipitationTableName);

export const useSpeciesList = useList(speciesTableName);
