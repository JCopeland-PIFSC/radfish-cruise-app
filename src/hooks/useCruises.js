import { useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";
import {
  userDataKey,
  cruiseTableName,
  stationTableName,
  userCruisesTableName,
} from "./useLoadCruisesAndStations";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { CruiseStatus } from "../utils/listLookup";
import { useAuth } from "../context/AuthContext";

const HOUR_MS = 1000 * 60 * 60;

export const useGetCruises = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, cruiseTableName],
    queryFn: async () =>
      await dbManager.getTableRecords(cruiseTableName, "-startDate"),
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useAddCruise = () => {
  const { user } = useAuth();
  if (!user || !user.id)
    throw new Error("Authorized User required to add Cruise!");

  const queryClient = useQueryClient();
  const { create, findOne, update } = useOfflineStorage();

  return useMutation({
    mutationFn: async ({ newCruise }) => {
      await create(cruiseTableName, newCruise);
      const newLocalCruise = await findOne(cruiseTableName, {
        id: newCruise.id,
      });
      const userCruises = await findOne(userCruisesTableName, { id: user.id });
      if (userCruises) {
        const uuid = userCruises.uuid ? userCruises.uuid : crypto.randomUUID();
        await update(userCruisesTableName, [
          {
            id: user.id,
            uuid,
            cruises: [...userCruises.cruises, newLocalCruise.id],
          },
        ]);
      } else {
        await create(userCruisesTableName, {
          id: user.id,
          uuid: crypto.randomUUID(),
          cruises: [newLocalCruise.id],
        });
      }
      return newLocalCruise;
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
      await dbManager.db.table(cruiseTableName).update(cruiseId, updates);
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
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useGetStationsByCruiseId = (cruiseId) => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, stationTableName, cruiseId],
    queryFn: async () =>
      await dbManager.getTableRecords(stationTableName, { cruiseId }),
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useGetStationById = (stationId) => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: [userDataKey, stationTableName, stationId],
    queryFn: async () =>
      await dbManager.getTableRecords(stationTableName, { id: stationId }),
    select: (data) => data?.[0] || null,
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useAddStation = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, newStation }) => {
      await dbManager.db.table(stationTableName).add(newStation);
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
      await dbManager.db.table(stationTableName).update(stationId, updates);
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

export const useCruiseStatusLock = (cruiseId) => {
  const { data } = useGetCruiseById(cruiseId);
  const isStatusLocked = useMemo(() => {
    if (!data || !data.cruiseStatusId) return false;

    return [CruiseStatus.SUBMITTED, CruiseStatus.ACCEPTED].includes(
      `${data.cruiseStatusId}`,
    );
  }, [data]);

  return { isStatusLocked };
};
