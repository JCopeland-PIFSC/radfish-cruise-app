import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import DatabaseManager from "../utils/DatabaseManager";

const HOUR_MS = 1000 * 60 * 60;

export const useGetCruises = () => {
  const dbManager = DatabaseManager.getInstance();
  return useQuery({
    queryKey: ["userData", "cruises"],
    queryFn: dbManager.getTableRecords("cruises", "-startDate"),
    staleTime: HOUR_MS * 1,
    cacheTime: HOUR_MS * 24,
  });
};

export const useSaveCruise = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCruise) => {
      const id = await dbManager.db.transaction("rw", "cruises", async () => {
        await dbManager.db.table("cruises").add(newCruise);
      });
      return { ...newCruise, id };
    },
    onSuccess: (newCruise) => {
      queryClient.setQueryData(["userData", "cruises"], (oldData = []) => [
        newCruise,
        ...oldData,
      ]);
    },
  });
};

export const useUpdateCruise = () => {
  const dbManager = DatabaseManager.getInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      await dbManager.db.transaction("rw", "cruises", async () => {
        await dbManager.db.table(["userData", "cruises"]).update(id, updates);
      });
      return { id, updates };
    },
    onSuccess: ({ id, updates }) => {
      queryClient.setQueryData("cruises", (oldData = []) =>
        oldData.map((cruise) =>
          cruise.id === id ? { ...cruise, ...updates } : cruise,
        ),
      );
    },
  });
};
