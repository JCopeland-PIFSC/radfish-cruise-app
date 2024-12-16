import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userDataKey } from "./useLoadCruisesAndStations";
import { useOfflineStorage } from "@nmfs-radfish/react-radfish";

export const useAddUser = () => {
  const userTableName = "users";
  const queryClient = useQueryClient();
  const { create, findOne } = useOfflineStorage();

  return useMutation({
    mutationFn: async ({ userData }) => {
      await create(userTableName, userData);
      return await findOne(userTableName, { id: userData.id });
    },
    onSuccess: (userData) => {
      queryClient.setQueryData([userDataKey, userTableName], (oldData = []) => [
        userData,
        ...oldData,
      ]);
    },
  });
};
