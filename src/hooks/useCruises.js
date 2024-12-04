import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";
import {
  userDataKey,
  cruiseTableName,
  stationTableName,
} from "./useLoadCruisesAndStations";

const HOUR_MS = 1000 * 60 * 60;

export const useGetCruises = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, cruiseTableName],
    queryFn: async () =>
      await dbManager.getTableRecords(cruiseTableName, "-startDate"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useAddCruise = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ newCruise }) => {
      await dbManager.db.transaction("rw", cruiseTableName, async () => {
        await dbManager.db.table(cruiseTableName).add(newCruise);
      });
      return newCruise;
    },
    onSuccess: (newCruise) => {
      queryClient.setQueryData(
        [userDataKey, cruiseTableName],
        (oldData = []) => [newCruise, ...oldData],
      );
    },
  });
};

export const useUpdateCruise = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, updates }) => {
      await dbManager.db.transaction("rw", cruiseTableName, async () => {
        await dbManager.db.table(cruiseTableName).update(cruiseId, updates);
      });
      return { cruiseId, updates };
    },
    onSuccess: ({ cruiseId, updates }) => {
      queryClient.setQueryData(
        [userDataKey, cruiseTableName, cruiseId],
        (oldData = {}) => ({
          ...oldData,
          ...updates,
        }),
      );
      queryClient.invalidateQueries([userDataKey, cruiseTableName]);
    },
  });
};

export const useGetCruiseById = (cruiseId) => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, cruiseTableName, cruiseId],
    queryFn: async () =>
      await dbManager.getTableRecords(cruiseTableName, { id: cruiseId }),
    select: (data) => data?.[0] || null,
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useGetStationsByCruiseId = (cruiseId) => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, stationTableName, cruiseId],
    queryFn: async () =>
      await dbManager.getTableRecords(stationTableName, { cruiseId }),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useGetStationById = (stationId) => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, stationTableName, stationId],
    queryFn: async () =>
      await dbManager.getTableRecords(stationTableName, { id: stationId }),
    select: (data) => data?.[0] || null,
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useAddStation = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, newStation }) => {
      await dbManager.db.transaction("rw", stationTableName, async () => {
        await dbManager.db.table(stationTableName).add(newStation);
      });
      return { cruiseId, newStation };
    },
    onSuccess: ({ cruiseId, newStation }) => {
      queryClient.setQueryData(
        [userDataKey, stationTableName, cruiseId],
        (oldData = []) => [newStation, ...oldData],
      );
    },
  });
};

export const useUpdateStation = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, stationId, updates }) => {
      debugger;
      await dbManager.db.transaction("rw", stationTableName, async () => {
        await dbManager.db.table(stationTableName).update(stationId, updates);
      });
      return { cruiseId, stationId, updates };
    },
    onSuccess: ({ cruiseId, stationId, updates }) => {
      queryClient.setQueryData(
        [userDataKey, stationTableName, stationId],
        (oldData = {}) => ({
          ...oldData,
          ...updates,
        }),
      );
      queryClient.invalidateQueries([userDataKey, stationTableName, cruiseId]);
    },
  });
};
