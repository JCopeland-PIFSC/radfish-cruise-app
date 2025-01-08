import { useEffect, useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  userDataKey,
  cruiseTableName,
  stationTableName,
  userCruisesTableName,
} from "./useLoadCruisesAndStations";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";
import { CruiseStatus } from "../utils/listLookup";
import { getUserCruisesList } from "../utils/databaseHelpers.js";
import { useAuth } from "../context/AuthContext";
const HOUR_MS = 1000 * 60 * 60;

export const useGetUserCruises = () => {
  const { storageMethod } = useOfflineStorage();
  const { user } = useAuth();
  const [cruises, setCruises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserCruises = async () => {
      if (!user || !user.id) {
        setError(new Error("Authorized User required to get Cruises"));
      } else {
        try {
          setLoading(true);
          const cruiseKeys = await getUserCruisesList(user.id);
          const fetchedCruises = await storageMethod.db
            .table(cruiseTableName)
            .bulkGet(cruiseKeys);
          setCruises(fetchedCruises);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserCruises();
  }, [storageMethod, user]);

  return { cruises, loading, error };
};

export const useAddCruise = () => {
  const { user } = useAuth();
  if (!user || !user.id)
    throw new Error("Authorized User required to add Cruise!");

  const { create, update, findOne } = useOfflineStorage();

  const addCruise = async (newCruise) => {
    try {
      await create(cruiseTableName, newCruise);
      const userCruises = await findOne(userCruisesTableName, {
        where: { id: user.id },
      });
      await update(userCruisesTableName, [
        {
          ...userCruises,
          cruises: [...userCruises.cruises, newCruise.id],
        },
      ]);
      return newCruise;
    } catch (error) {
      throw new Error(`Error adding new cruise: ${error}`);
    }
  };

  return { addCruise };
};

export const useUpdateCruise = () => {
  const { update } = useOfflineStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, updates }) => {
      await update(cruiseTableName, updates);
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
  const { findOne } = useOfflineStorage();
  return useQuery({
    queryKey: [userDataKey, cruiseTableName, cruiseId],
    queryFn: async () => await findOne(cruiseTableName, { id: cruiseId }),
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useGetStationsByCruiseId = (cruiseId) => {
  const { find } = useOfflineStorage();
  return useQuery({
    queryKey: [userDataKey, stationTableName, cruiseId],
    queryFn: async () => await find(stationTableName, { cruiseId }),
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useGetStationById = (stationId) => {
  const { findOne } = useOfflineStorage();
  return useQuery({
    queryKey: [userDataKey, stationTableName, stationId],
    queryFn: async () => await find(stationTableName, { id: stationId }),
    staleTime: 0,
    cacheTime: 0,
  });
};

export const useAddStation = () => {
  const { create } = useOfflineStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, newStation }) => {
      await create(stationTableName, newStation);
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
  const { update } = useOfflineStorage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cruiseId, stationId, updates }) => {
      await update(stationTableName, stationId, updates);
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
